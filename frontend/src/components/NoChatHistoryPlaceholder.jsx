import { MessageCircleIcon } from "lucide-react";
import React from "react";

const NoChatHistoryPlaceholder = ({ name }) => {
  const displayName = name || "this person";
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <MessageCircleIcon className="h-8 w-8 text-dirty-blue-300" />
      </div>
      <h3 className="text-lg font-semibold text-white">
        Start a conversation with {displayName}
      </h3>
      <p className="max-w-sm text-sm text-white/70">
        Say hello or share an update. Messages stay synced across every device.
      </p>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
