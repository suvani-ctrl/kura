import React from "react";
import { Sparkles, Users } from "lucide-react";

const ConversationPlaceholder = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-white/80">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Users className="h-8 w-8 text-dirty-blue-300" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Welcome to ChatApp</h3>
        <p className="mx-auto mt-1 max-w-xs text-sm text-white/70">
          Choose a chat on the left to start a conversation.
        </p>
      </div>
    </div>
  );
};

export default ConversationPlaceholder;
