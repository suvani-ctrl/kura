import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { socket } from "../socket/socket";
import { registerSocketListeners } from "../socket/listeners";

export const useauthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile:false,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Account created");
     
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      const {authUser} = get()
      setTimeout(() => {
      socket.connect();
      registerSocketListeners();
}, 50);
      toast.success("Logged in");
      console.log("auth user id:", authUser._id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
      setTimeout(() => {
      socket.connect();
      registerSocketListeners();
}, 50);
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post("/auth/logout");
        set({authUser:null})
        socket.disconnect()
        toast.success("Logged out successfully")
    } catch (error) {
        toast.error('error logging out');
        console.log(error)
    }
  },
  
  forgotPassword: async (email) =>{
    try {
      await axiosInstance.post("/auth/forgot-password",{email});
      toast.success("Email sent successfully!")
    } catch (error) {
      toast.error("error sending email..");
      console.log(error)
    }
  },
  resetPassword: async ({ token, userId, newPassword }) => {
  try {
    await axiosInstance.post("/auth/reset-password", { token, userId, newPassword });
    toast.success("Password reset successful");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to reset password");
  }
},
  updateProfile: async (profilePic) => {
  set({ isUpdatingProfile: true });
  try {
    const response = await axiosInstance.put("/auth/update-profile", { profilePic });
    
    // Immediately fetch fresh user data
    const checkResponse = await axiosInstance.get("/auth/check");
    set({ 
      authUser: checkResponse.data.user,
      isUpdatingProfile: false 
    });
    
    toast.success("Profile updated successfully");
  } catch (error) {
    set({ isUpdatingProfile: false });
    toast.error("Failed to update profile");
  }
}
}));