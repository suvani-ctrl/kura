import User from "../../models/User.js";

export const emailExists = async(email) =>{

    const existingUser = await User.findOne({email});
    return !!existingUser;
    }