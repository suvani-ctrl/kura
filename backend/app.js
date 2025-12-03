import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { connectDB } from "./src/lib/db.js";
import { ENV } from "./src/lib/env.js";
import authRoute from "./src/routes/authRoute.js";
import messageRoute from "./src/routes/messageRoute.js";
import morgan from "morgan";
import { initializeSocketServer } from "./socket/socketServer.js";

const PORT = ENV.PORT || 5000;
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    ENV.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(morgan("dev"))
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static("public")); 
app.use(cookieParser()); 

app.use("/api/auth", authRoute);


app.use("/api/messages", messageRoute);

const startServer = async () => {
    try {
        await connectDB(); 
        console.log('Database connected successfully.');

        // Create HTTP server from Express app
        const server = http.createServer(app);

        // Initialize Socket.IO server
        initializeSocketServer(server);
        console.log('Socket.IO server initialized.');

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server running successfully on port ${PORT}`);
            console.log(`Socket.IO server is available on the same port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server due to DB error:", error.message);
        process.exit(1); 
    }
};

startServer();