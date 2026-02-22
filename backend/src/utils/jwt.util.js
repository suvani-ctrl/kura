import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRY = '1h';
const ONE_HOUR_MS = 60 * 60 * 1000;

export const authCookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: ONE_HOUR_MS
};

export const generateToken = (payload) => {
    if (!ENV.JWT_SECRET) {
        throw new Error('JWT_SECRET is undefined');
    }
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
    
    try {
        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw error;
    }
    
    
};