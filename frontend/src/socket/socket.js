import { io } from "socket.io-client";

// Get the socket URL from environment or use default
const getSocketURL = () => {
  // In development, use localhost with the backend port
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000"; // Same port as backend API
  }
  // In production, use the same origin as the API
  return window.location.origin;
};

export const socket = io(getSocketURL(), {
  withCredentials: true,
  autoConnect: false, 
});
