import Message from "../../../models/Message.js";
import User from "../../../models/User.js";
import cloudinary from "../../lib/cloudinary.js";
import asyncHandler from 'express-async-handler';
import fs from "fs/promises";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../../uploads');

// Function to ensure uploads directory exists
const ensureUploadsDir = async () => {
    try {
        await fs.access(uploadsDir);
    } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
    }
};

ensureUploadsDir().catch(err => {
    console.error("Failed to create uploads directory:", err);
});

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// File filter function for security
const fileFilter = (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isAllowedFile = ALLOWED_FILE_TYPES.includes(file.mimetype);
    
    if (isImage) {
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`), false);
        }
    } else if (isAllowedFile) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`), false);
    }
};

// Sanitize filename to prevent directory traversal and special characters
const sanitizeFilename = (filename) => {
    // Remove path separators and dangerous characters
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.\./g, '_')
        .substring(0, 255); // Limit filename length
};

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const sanitized = sanitizeFilename(file.originalname);
        cb(null, `${Date.now()}-${sanitized}`);
    }
});

// Multer configuration with security limits
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE, // 10MB max
        files: 1, // Only one file at a time
    }
}); 

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
    let tempFilePath = null;
    
    try {
        const {text} = req.body; 
        const file = req.file;
        const senderId = req.user._id;
        const {id: receiverId} = req.params;
        let imageUrl = null;
        let fileUrl = null;

        // Validation: Must have either text or file
        if(!text && !file){
            return res.status(400).json({
                message: "Provide a text or a file to send message"
            });
        }

        // Validate file if present
        if(file){
            tempFilePath = file.path;
            
            // Additional file size check (redundant but safe)
            const fileStats = await fs.stat(file.path);
            const isImage = file.mimetype.startsWith('image/');
            const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
            
            if(fileStats.size > maxSize){
                await fs.unlink(file.path);
                return res.status(400).json({
                    message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
                });
            }

            // Validate file type again (defense in depth)
            if(isImage && !ALLOWED_IMAGE_TYPES.includes(file.mimetype)){
                await fs.unlink(file.path);
                return res.status(400).json({
                    message: "Invalid image type"
                });
            }
            
            if(!isImage && !ALLOWED_FILE_TYPES.includes(file.mimetype)){
                await fs.unlink(file.path);
                return res.status(400).json({
                    message: "Invalid file type"
                });
            }

            // Upload to Cloudinary
            try {
                const uploadResponse = await cloudinary.uploader.upload(file.path, {
                    resource_type: isImage ? 'image' : 'raw',
                    folder: `chat_app/users/${senderId.toString()}`,
                    // Additional security: limit image dimensions
                    ...(isImage && {
                        transformation: [
                            { width: 2000, height: 2000, crop: 'limit' }, // Max dimensions
                            { quality: 'auto' }
                        ]
                    })
                });
                
                if(isImage){ 
                    imageUrl = uploadResponse.secure_url;
                } else {
                    fileUrl = uploadResponse.secure_url;
                }
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                await fs.unlink(file.path).catch(() => {});
                return res.status(500).json({
                    message: "Failed to upload file to storage"
                });
            }
            
            // Clean up temp file after successful upload
            await fs.unlink(file.path).catch(error => {
                console.error("Failed to delete temp file:", error.message);
            });
            tempFilePath = null; // Mark as cleaned
        }

        // Create message in database
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: text || "",
            image: imageUrl,
            file: fileUrl
        });
        
        console.log(`Message created: ${newMessage._id}, image: ${!!imageUrl}, file: ${!!fileUrl}`);
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in send Message controller:", error.message);
        
        // Cleanup temp file on error
        if(tempFilePath){
            await fs.unlink(tempFilePath).catch(err => {
                console.error("Failed to cleanup temp file:", err.message);
            });
        }
        
        // Return appropriate error message
        if(error.name === 'ValidationError'){
            return res.status(400).json({
                message: "Invalid message data",
                error: error.message
            });
        }
        
        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

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
