import User from "../../models/User.js";
import bcrypt from "bcrypt";
import zxcvbn from "zxcvbn";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import sendWelcomeEmail, { sendEmailforForgotPassword } from "../email/mailTrap.js";
import cloudinary from "../lib/cloudinary.js";
import isPwned from "../lib/security.js";
import Token from "../../models/Token.js";
import { ENV } from "../lib/env.js";

const ONE_HOUR_MS = 60 * 60 * 1000;
const TOKEN_EXPIRY = "1h";

const authCookieBaseOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
};

const authCookieOptions = {
    ...authCookieBaseOptions,
    maxAge: ONE_HOUR_MS
};

const signSessionToken = (payload) => {
    if (!ENV.JWT_SECRET) {
        throw new Error("JWT_SECRET is undefined. Check your env configuration.");
    }

    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

// ---------------------- SIGNUP -------------------------------------

export const signup = async (req, res) => {
    try {
        const { email, password, username, profilePic } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Email validation
        const cleanEmail = email.trim().toLowerCase();
        const cleanUser = username.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(cleanEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Password rules
        if (password.length < 10) {
            return res.status(400).json({ message: "Password must be at least 10 characters" });
        }

        const strength = zxcvbn(password);
        if (strength.score < 3) {
            return res.status(400).json({
                message: "Password is too weak",
                suggestions: strength.feedback.suggestions
            });
        }

        if (await isPwned(password)) {
            return res.status(400).json({ message: "Password found in data breaches" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: cleanEmail,
            password: hashedPassword,
            username: cleanUser,
            profilePic
        });

        // Generate token
        const token = signSessionToken({ userId: newUser._id, role: newUser.role });

        try {
            await sendWelcomeEmail(newUser.email, newUser.username);
        } catch (e) {
            console.error("Email sending failed:", e);
        }

        res.cookie("token", token, authCookieOptions);

        return res.status(201).json({
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


// ---------------------- LOGIN -------------------------------------

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!password || (!email && !username)) {
            return res.status(400).json({ message: "Missing credentials" });
        }

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(401).json({ loggedin: false, message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ loggedin: false, message: "Invalid credentials" });
        }

        const token = signSessionToken({ userId: user._id, role: user.role });

        res.cookie("token", token, authCookieOptions);

        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ loggedin: false, message: "Server error" });
    }
};


// ---------------------- FORGOT PASSWORD -------------------------------------

export const forgotPassword = async (req, res) => {
    try {
        const { email, username } = req.body;

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(202).json({
                message: "If the account exists, a reset link has been sent"
            });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString("hex");

        await Token.deleteOne({ userId: user._id });

        await Token.create({ userId: user._id, token: resetToken });

        const baseUrl = ENV.CLIENT_URL || "http://localhost:5173";
        const resetURL = `${baseUrl}/reset-password?token=${resetToken}&userId=${user._id}`;
        await sendEmailforForgotPassword(user.email, resetURL);

        return res.status(202).json({
            message: "If the account exists, a reset link has been sent"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ---------------------- RESET PASSWORD -------------------------------------

export const passwordReset = async (req, res) => {
    try {
        const { token, userId, newPassword } = req.body;

        if (!token || !userId || !newPassword) {
            return res.status(400).json({ message: "Missing required information" });
        }

        const tokenDoc = await Token.findOne({ token, userId });
        if (!tokenDoc) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = req.hashedPassword || await bcrypt.hash(newPassword, 10);

        const user = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Token.deleteOne({ _id: tokenDoc._id });

        return res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ---------------------- UPDATE PROFILE PICTURE -------------------------------------

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    
    if (!profilePic) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(profilePic, {
      resource_type: "auto"
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic
      }
    });

  } catch (error) {
    console.error("ERROR in updateProfile:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ---------------------- AUTH CHECK -------------------------------------

export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

// ---------------------- LOGOUT -------------------------------------

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", authCookieBaseOptions);
        
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};