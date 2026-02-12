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

   sendMessage: async(messageData) => {
    const {messages, selectedUser} = get();
    const {authUser} = useauthStore.getState();

    if(!authUser?._id){
        toast.error("You must be logged in");
        return;
    }

    if(!selectedUser?._id){
        toast.error("No user selected");
        return;
    }
    
    const temp_id = `temp-${Date.now()}`;
    
    // ✅ Check if attachment exists (can be File object or base64 string)
    const hasAttachment = !!messageData.attachment;
    const isAttachmentObject = hasAttachment && typeof messageData.attachment === "object" && messageData.attachment.rawFile;
    const isAttachmentString = hasAttachment && typeof messageData.attachment === "string";
    
    // Determine if it's an image
    let isImage = false;
    let fileToUpload = null;
    
    if (isAttachmentObject) {
        // File object from file input
        fileToUpload = messageData.attachment.rawFile;
        isImage = fileToUpload.type?.startsWith('image/');
    } else if (isAttachmentString) {
        // Base64 string from image input or camera
        // Convert base64 to Blob/File
        try {
            const base64Data = messageData.attachment;
            const response = await fetch(base64Data);
            const blob = await response.blob();
            
            // Create a File from the blob
            const fileName = `image-${Date.now()}.jpg`;
            fileToUpload = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
            isImage = true; // Base64 strings are always images in this app
        } catch (err) {
            console.error("Failed to convert base64 to file:", err);
            toast.error("Failed to process image");
            return;
        }
    }
    
    const optimisticMessage = {
        _id: temp_id,
        senderId: authUser._id,
        receiverId: selectedUser._id,
        text: messageData.text || "",
        image: isImage ? "uploading..." : null,
        file: hasAttachment && !isImage ? "uploading..." : null,
        createdAt: new Date().toISOString(),
    };
    
    set({messages: [...messages, optimisticMessage]});
    
    try {
        let response;
        
        if(hasAttachment && fileToUpload) {
            console.log('Uploading file:', {
                name: fileToUpload.name,
                type: fileToUpload.type,
                size: fileToUpload.size,
                isImage: isImage
            });
            
            const formData = new FormData();
            formData.append('text', messageData.text || '');
            formData.append('file', fileToUpload);
            
            response = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                formData,
                {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
            );
        } else {
            response = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                {
                    text: messageData.text
                }
            ); 
        }
        
        const realMessage = response.data;
        
        set({
            messages: get().messages.map((msg) =>
                msg._id === temp_id ? realMessage : msg
            ) 
        });
    } catch (error) {
        set({
            messages: get().messages.filter((msg) => msg._id !== temp_id)
        });
        toast.error(error.response?.data?.message || "Failed to send message");
    }
}

}));