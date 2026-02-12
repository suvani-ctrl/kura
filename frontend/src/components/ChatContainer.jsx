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

              if(!msg) return null;
              const isMe = msg.senderId === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble relative min-h-0 max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-md ${isMe
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-0"
                        : "bg-dirty-blue-800 text-gray-100 border border-white/10"
                      }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="shared"
                        className="rounded-lg h-48 object-cover mb-2"
                      />
                    )}

                    {msg.file && (
                      <div className="mb-2 p-3 bg-white/10 rounded-lg border border-white/20">
                        <a
                          href={msg.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {msg.file.includes('.pdf') ? 'PDF Document' : 'Download File'}
                          </span>
                        </a>
                      </div>
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
    </div >
  );
}

export default ChatContainer;
