// backend/src/lib/env.js
import dotenv from "dotenv";
dotenv.config(); // loads .env into process.env

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // database + auth
  MONGO_URI: "mongodb+srv://suvani:suvaniisokay@cluster0.8lxzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  JWT_SECRET: process.env.JWT_SECRET,

  // email / resend
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLIENT_URL: process.env.CLIENT_URL,

  // cloudinary credentials
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ARCJET_KEY: process.env.ARCJET_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV,
  HASH_ROUNDS: process.env.HASH_ROUNDS,

  // redis credentials
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  SESSION_EXPIRY: process.env.SESSION_EXPIRY,

  // socket
  SOCKET_CONNECTION_PORT: process.env.SOCKET_CONNECTION_PORT || 9000,
  SESSION_SECRET: process.env.session_secret
};
