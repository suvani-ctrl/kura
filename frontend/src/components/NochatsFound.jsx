import { MessageCircleIcon } from "lucide-react";
import { chatStore } from "../store/ChatStore";
import React from "react";

function NoChatsFound() {
  const { setActiveTab } = chatStore();

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <MessageCircleIcon className="h-7 w-7 text-dirty-blue-300" />
      </div>
      <div>
        <h4 className="mb-1 text-sm font-semibold text-white">No conversations yet</h4>
        <p className="px-6 text-xs text-white/60">
          Tap contacts to start your first chat.
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-dirty-blue-300"
      >
        Go to contacts
      </button>
    </div>
  );
}
export default NoChatsFound;