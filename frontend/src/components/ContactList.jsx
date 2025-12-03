import React, { useEffect } from "react";
import { chatStore } from "../store/ChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

const ContactList = () => {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    selectedUser,
    isContactsLoading
  } = chatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isContactsLoading) return <UsersLoadingSkeleton />;

  if (!allContacts.length) {
    return (
      <div className="text-center text-slate-400 text-sm py-10">
        No contacts yet. Invite a friend to get started.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/5">
      {allContacts.map((contact) => {
        const isActive = selectedUser?._id === contact._id;

        return (
          <li key={contact._id}>
            <button
              onClick={() => setSelectedUser(contact)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive ? "bg-dirty-blue-800/70" : "hover:bg-white/5"
              }`}
            >
              <div className="relative">
                <img
                  src={contact.profilePic || "/avatar.jpg"}
                  alt={contact.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-dirty-blue-900 bg-emerald-500"></span>
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  {contact.username}
                </p>
                <p className="text-xs text-white/60">{contact.email}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ContactList;
