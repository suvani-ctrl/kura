import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Message from "../../models/Message.js";

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
    allFriends.forEach((msg) =>{
        if(msg.senderId.toString() !== myId){
                partnerIds.add(msg.senderId.toString());
        }else{
            partnerIds.add(msg.receiverId.toString());
        }
    })

    if(partnerIds.size === 0) return [];

    const allMyFriends = await User.find({
        _id:  {
            $in :Array.from(partnerIds)
        }
    }).select("email username profilePic createdAt ").lean();

    return allMyFriends;


});


export const getsingleChat_ = expressAsyncHandler(async(myId1,myfriendsId2) =>{
    
    //     const personalMessages = await Message.updateMany({
    //     $or : [
    //         {senderId: myId1.toString()},
    //         {receiverId:myfriendsId2.toString(),
    //          isRead:false
    //         },
    //         {
    //             $set:{isRead: true}
    //         }
    //     ]
    // });
    const finalMessages = await Message.find({
        $or:
            [{senderId: myId1.toString(), receiverId: myfriendsId2.toString()},
            {senderId: myfriendsId2.toString(), receiverId: myId1.toString()}   
            ]
        
    }).sort({createdAt:-1}).lean();

    return res.status(200).json({
        finalMessages
    })

});