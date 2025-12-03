import mongoose from "mongoose"

const chatroomSchema = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: "Message"
    }},
    {timestamps: true})


const chatRoom = mongoose.model("chatRoom", chatroomSchema);
export default chatRoom;