import React, { useEffect } from "react";
import { chatStore } from "../store/ChatStore";
import NoChatsFound from "./NochatsFound";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

const ChatList = () => {
  const {
    getMyChatPartners,
    chats,
    setSelectedUser,
    selectedUser,
    isChatsLoading
  } = chatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isChatsLoading) return <UsersLoadingSkeleton />;
  if (!chats.length) return <NoChatsFound />;

  return (
    <ul className="divide-y divide-white/5">
      {chats.map((user) => {
        const isActive = selectedUser?._id === user._id;

        return (
          <li key={user._id}>
            <button
              onClick={() => setSelectedUser(user)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-dirty-blue-800/70"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.jpg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-dirty-blue-900 bg-emerald-500"></span>
              </div>

              <div className="flex-1 text-left">
                <p className="truncate text-sm font-medium text-white">
                  {user.username}
                </p>
                <p className="text-xs text-white/60 truncate">Tap to chat</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
