import Message from "../../../models/Message.js";
import User from "../../../models/User.js";
import cloudinary from "../../lib/cloudinary.js";
import asyncHandler from "express-async-handler";

export const checkme = async (req, res) => {
    res.status(200).json({
        message: "check"
    });
};

export const getallContact = async (req, res) => {
    try {
        const contacts = await User.find({
            _id: { $ne: req.user._id }
        })
            .select("-password")
            .lean();

        return res.status(200).json({
            all_contacts: contacts
        });
    } catch (error) {
        console.log("error in get all contacts", error);
        res.status(500).json({
            message: "server error"
        });
    }
};

export const getsingleChat = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        await Message.updateMany(
            {
                receiverId: myId.toString(),
                senderId: userToChatId.toString(),
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            messages
        });
    } catch (error) {
        console.log("error fetching messages", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({
                message: "Provide text or an image to send a message"
            });
        }

        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                resource_type: "auto"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const getChatPartners = asyncHandler(async (req, res) => {
    try {
        const myId = req.user._id;

        const myMessages = await Message.find({
            $or: [
                { senderId: myId },
                { receiverId: myId }
            ]
        }).lean();

        const partnerIds = new Set();
        myMessages.forEach(message => {
            if (message.senderId.toString() !== myId.toString()) {
                partnerIds.add(message.senderId.toString());
            }
            if (message.receiverId.toString() !== myId.toString()) {
                partnerIds.add(message.receiverId.toString());
            }
        });

        const chatPartners = await User.find({
            _id: { $in: Array.from(partnerIds) }
        })
            .select("email username profilePic createdAt")
            .lean();

        return res.json(chatPartners);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});