import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    if (!ENV.MONGO_URI) {
        throw new Error("MONGO_URI is not defined. Please update your environment variables.");
    }

    try {
        await mongoose.connect(ENV.MONGO_URI, {
            autoIndex: ENV.NODE_ENV !== "production"
        });
        isConnected = true;
        console.log("MongoDB connected");

        mongoose.connection.on("disconnected", () => {
            isConnected = false;
            console.warn("MongoDB disconnected");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};