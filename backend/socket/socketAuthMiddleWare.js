import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ENV } from "../src/lib/env.js";

export default function socketAuthMiddleWare(socket, next) {
  try {
    const rawCookies = socket.handshake.headers.cookie;
    if (!rawCookies) return next(new Error("Authentication Error"));

    const parsed = cookie.parse(rawCookies);
    const token = parsed.token;
    if (!token) return next(new Error("Authentication Error"));

    const payload = jwt.verify(token, ENV.JWT_SECRET);
    socket.user = payload; 
    next();
  } catch (err) {
    next(new Error("Authentication Error"));
  }
}
