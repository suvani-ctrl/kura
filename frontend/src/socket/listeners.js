// frontend/src/socket/listeners.js
import { socket } from "./socket";

export const registerSocketListeners = () => {
  socket.on("connect", () => {
    console.log("SOCKET CONNECTED:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTED");
  });

  socket.on("connect_error", (err) => {
    console.error("SOCKET CONNECTION FAILED:", err.message);
  });

  // Optional test event from server
  socket.on("test", (data) => {
    console.log("Received from server:", data);
  });
};
