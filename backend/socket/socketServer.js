// backend/socket/socketServer.js
import { Server as SocketIOServer } from "socket.io";
import { ENV } from "../src/lib/env.js";
import socketAuthMiddleWare from "./socketAuthMiddleWare.js";

// --- Allowed origins for CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  ENV.CLIENT_URL
].filter(Boolean);

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - HTTP server instance from Express
 * @returns {SocketIOServer} - Socket.IO server instance
 */

export function initializeSocketServer(server) {
  // --- Socket.IO setup ---
  const io = new SocketIOServer(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleWare);

  // --- Socket connection handling ---
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id} (User: ${socket.user?.userId || 'Unknown'})`);

    // Example: send a test event to the client
    socket.emit('test', { message: 'Connected successfully!' });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  }); 

  return io;
}
