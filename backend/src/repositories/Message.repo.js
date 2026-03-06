import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Message from "../../models/Message.js";
import { getChatPartners } from "../controllers/MessagesController/getallcontacts.js";

export const getallContacts_ = expressAsyncHandler(async(currentUserId) =>{
    return await User.find({
        _id : {$ne: currentUserId}
    }).select("-password").lean();
});

export const getchatPartners_ = expressAsyncHandler(async(myId) => {
    const allFriends =  await Message.find({
        $or: [
            {senderId: myId},
            {receiverId:myId}
        ]
    }).lean();

    const partnerIds = new Set();
    allFriends.forEach({
        if(Message.)
    })

});