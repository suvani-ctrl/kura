import React, { useEffect } from "react";
import { chatStore } from "../store/ChatStore";
import { ArrowLeft, XIcon } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = chatStore();

  // if esc is pressed slick back

  useEffect(() =>{

    const handleEscKey = (event) =>{
      if(event.key === 'Escape'){
        setSelectedUser(null);
      }
    }
    window.addEventListener('keydown', handleEscKey);

    return () =>{
      window.removeEventListener('keydown', handleEscKey)
    }
  },[setSelectedUser])

  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-dirty-blue-900/80 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedUser(null)}
          className="rounded-full p-2 text-white/80 transition-colors hover:text-white md:hidden"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.jpg"}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-dirty-blue-900 bg-emerald-500"></span>
        </div>

        <div>
          <p className="text-sm font-medium">{selectedUser.username}</p>
          <p className="text-xs text-white/60">Online</p>
        </div>
      </div>

    <button onClick={() => setSelectedUser(null)}>
      <XIcon
      className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      />
    </button>     
    </header>
  );
};

export default ChatHeader;
