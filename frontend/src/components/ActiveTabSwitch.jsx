import React from "react";
import { chatStore } from "../store/ChatStore";

const tabs = [
  { id: "chats", label: "Chats" },
  { id: "contacts", label: "Contacts" }
];

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = chatStore();

  return (
    <div className="grid grid-cols-2 rounded-full border border-white/10 bg-dirty-blue-900/60 p-1 text-sm font-medium">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 transition-colors ${
              isActive
                ? "bg-dirty-blue-600 text-white"
                : "text-white/70 hover:bg-dirty-blue-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default ActiveTabSwitch;
