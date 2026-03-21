import { ENV } from "../lib/env.js";

const ONE_HOUR_MS = 60 * 60 * 1000;

export const authCookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: ONE_HOUR_MS
};


export const mySessionId = () =>{
    const sessionId = crypto.randomBytes(16).toString('hex');
    return sessionId;
}