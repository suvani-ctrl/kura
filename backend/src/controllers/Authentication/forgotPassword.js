import crypto from "crypto";
import Token from "../../../models/Token.js";
import User from "../../../models/User.js";
import { ENV } from "../../lib/env.js";
import { sendEmailforForgotPassword } from "../../email/mailTrap.js";

export const forgotPassword = async (req, res) => {
    const { email,username } = req.body;
    try {
        if (!email && !username){
            return res.status(400).json({
                message: "Not enough credentials"
            })
        }
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(202).json({
                message: "If the account exists, a reset link will be sent"
            });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString("hex");
        await Token.deleteOne({ userId: user._id });
        await Token.create({ userId: user._id, token: resetToken });

        const baseUrl = ENV.CLIENT_URL || "http://localhost:5173";
        const resetURL = `${baseUrl}/reset-password?token=${resetToken}&userId=${user._id}`;

        await sendEmailforForgotPassword(user.email, resetURL);
        
        return res.status(200).json({
            success: true,
            message: "Password Reset Link has been sent"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};