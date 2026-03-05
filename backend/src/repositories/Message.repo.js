import User from "../../models/User.js";

export const getallContacts = async(currentUserId) =>{
    return await User.find({
        _id : {$ne: currentUserId}
    }).select("-password").lean();
};