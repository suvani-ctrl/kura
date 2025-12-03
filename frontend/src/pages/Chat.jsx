import React from "react";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ContactList from "../components/ContactList";
import ConversationPlaceholder from "../components/ConversationPlaceholder";
import ChatList from "../components/ChatList";
import ChatContainer from "../components/ChatContainer";
import { chatStore } from "../store/ChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = chatStore();

  return (
    <div className="flex h-screen w-full bg-dirty-blue-900/95 text-white">
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`flex h-full flex-col border-b border-white/10 bg-dirty-blue-900/70 backdrop-blur-sm md:border-b-0 md:border-r ${
            selectedUser ? "hidden md:flex md:w-[360px]" : "flex w-full md:w-[360px]"
          }`}
        >
          <ProfileHeader />
          <div className="px-4 py-2">
            <ActiveTabSwitch />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>
        </aside>

        {/* Chat Area */}
        <main
          className={`flex flex-1 flex-col bg-dirty-blue-850 ${
            selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedUser ? <ChatContainer /> : <ConversationPlaceholder />}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
