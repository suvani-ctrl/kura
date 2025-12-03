import React, { useEffect } from "react";
import { chatStore } from "../store/ChatStore";
import { useauthStore } from "../store/Authstore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessageLoadingSkeleton";

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } = chatStore();
  const { authUser } = useauthStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center text-slate-400">
        Select a user to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isMe = msg.senderId === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble relative ${
                      isMe
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="shared"
                        className="rounded-lg h-48 object-cover"
                      />
                    )}

                    {msg.text && <p className="mt-2">{msg.text}</p>}

                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.createdAt).toISOString().slice(11, 16)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
