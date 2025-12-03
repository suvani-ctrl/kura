import React, { useRef, useState } from 'react';
import { LogOut, Camera, Volume2, VolumeOff, Loader } from "lucide-react";
import { chatStore } from '../store/ChatStore';
import { useauthStore } from '../store/Authstore';

const mouseClickSound = new Audio("/mouse-click.mp3");

const ProfileHeader = () => {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useauthStore();
  const { isSoundEnabled, toggleSound } = chatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setSelectedImg(reader.result);
      await updateProfile(reader.result);
      setSelectedImg(null);
    };
  };

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-dirty-blue-850 px-4 py-3">

      {/* Avatar + Username */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-dirty-blue-800"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader className="w-4 h-4 animate-spin text-white" />
              </div>
            )}
            <img
              src={authUser?.profilePic || '/avatar.jpg'}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={14} className="text-white" />
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
            disabled={isUpdatingProfile}
          />
        </div>

        <div className="truncate">
          <h3 className="truncate text-sm font-medium text-white">
            {authUser?.username || 'User'}
          </h3>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          className="text-white/70 transition-colors hover:text-dirty-blue-300"
          onClick={() => {
            mouseClickSound.currentTime = 0;
            mouseClickSound.play().catch(() => { });
            toggleSound();
          }}
        >
          {isSoundEnabled ? <Volume2 size={18} /> : <VolumeOff size={18} />}
        </button>
        <button
          className="text-white/70 transition-colors hover:text-dirty-blue-300"
          onClick={logout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
