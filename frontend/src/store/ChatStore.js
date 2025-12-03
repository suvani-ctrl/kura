import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useauthStore } from "./Authstore";

const getInitialSoundPreference = () => {
    if (typeof window === "undefined") return true;
    try {
        return JSON.parse(window.localStorage.getItem("isSoundEnabled")) === true;
    } catch (error) {
        return true;
    }
};

export const chatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isContactsLoading: false,
    isChatsLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    isSoundEnabled: getInitialSoundPreference(),

    toggleSound: () => {
        const nextValue = !get().isSoundEnabled;
        if (typeof window !== "undefined") {
            window.localStorage.setItem("isSoundEnabled", JSON.stringify(nextValue));
        }
        set({ isSoundEnabled: nextValue });
    },

    setActiveTab: (tab) => set({ activeTab: tab.toLowerCase() }),
    setSelectedUser: (selectedUser) => set({ selectedUser, messages: [] }),

    getAllContacts: async () => {
        set({ isContactsLoading: true });
        try {
            const response = await axiosInstance.get("/messages/contacts");
            const contacts = response.data?.all_contacts ?? [];
            set({ allContacts: contacts });
        } catch (error) {
            console.error("Get contacts error:", error);
            toast.error(error.response?.data?.message || "Failed to load contacts");
        } finally {
            set({ isContactsLoading: false });
        }
    },

    getMyChatPartners: async () => {
        set({ isChatsLoading: true });
        try {
            const response = await axiosInstance.get("/messages/chats");
            const chatPartners = response.data ?? [];
            set({ chats: chatPartners });
        } catch (error) {
            console.error("Get chat partners error:", error);
            toast.error(error.response?.data?.message || "Failed to load chats");
        } finally {
            set({ isChatsLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/chat/${userId}`);
            const serverMessages = response.data?.messages ?? [];
            // Server returns newest first; flip for chronological display
            set({ messages: [...serverMessages].reverse() });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages");
            console.log('failed to getmsg by userid', error)
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
    const { messages, selectedUser } = get();
    const { authUser } = useauthStore.getState();

    if (!selectedUser?._id) {
        toast.error("No user selected");
        return;
    }

    const temp_id = `temp-${Date.now()}`;
    const optimisticMessage = {
    _id: temp_id,
    senderId: authUser._id,
    receiverId: selectedUser._id,
    text: messageData.text || "",
    image: messageData.image || null,
    createdAt: new Date().toISOString(),
    optimistic: true
};


    // Add optimistic message to UI immediately
    set({ messages: [...messages, optimisticMessage] });

    try {
        const response = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData
        );

        const realMessage = response.data;

        // Replace the optimistic message with real one
        set({
            messages: get().messages.map((msg) =>
                msg._id === temp_id ? realMessage : msg
            ),
        });

    } catch (error) {
        // Remove optimistic message if send failed
        set({
            messages: get().messages.filter((msg) => msg._id !== temp_id),
        });

        toast.error(error.response?.data?.message || "Failed to send message");
    }
},

}));