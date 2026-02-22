import User from "../../models/User.js";
import bcrypt from "bcrypt";
import zxcvbn from "zxcvbn";
import crypto from "crypto";
import sendWelcomeEmail, { sendEmailforForgotPassword, sendEmailForResetPassword } from "../email/mailTrap.js";
import cloudinary from "../lib/cloudinary.js";
import isPwned from "../lib/security.js";
import Token from "../../models/Token.js";
import { ENV } from "../lib/env.js";
import { generateToken,verifyToken,authCookieOptions } from "../utils/jwt.util.js";
import { validateandHashPassword } from "../utils/password.util.js";
import { comparePassword } from "../utils/comparePassword.js";
import { cleanEmail, emailChecker } from "../utils/email.check.js";
import { emailExists } from "../repositories/email.repo.js";

// ---------------------- SIGNUP -------------------------------------



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

        const validPassword = comparePassword();
      
         if (!validPassword) {
            return res.status(401).json({ loggedin: false, message: "Invalid credentials" });
        }

        const token = generateToken({ userId: user._id, role: user.role });

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


// ---------------------- RESET PASSWORD -------------------------------------

export const passwordReset = async (req, res) => {
    const {token,userId} = req.body;
    console.log(token);
    console.log(userId);
    console.log(req.query);
    try{

        if(!token || !userId){
            return res.status(404).json({
            success:false,
            message:"Token not found"
        })
        }else{
        const check_token = await Token.findOne({
            $and:[
                {token:token},
                {userId: userId}
            ]})
        if(!check_token){
            return res.status(404).send({
                success:false,
                message: "Invalid Token"
            })
        }
    }
    const {newPassword} = req.body;
        if(!newPassword){
            return res.status(404).send("Please insert a valid password");
        }else{
            const new_pass = makePassword(newPassword);
        }
       
        const update_password = await User.findByIdAndUpdate(
            userId,{
                password: new_pass
            }
        )
        await Token.deleteOne({userId})
        {
            return res.status(200).json({
                success:true,
                message: "Password reset done"
            })
        }
}  catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error ! cant change the password"
    })
    console.error(error)
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

        const decoded = verifyToken(token);

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