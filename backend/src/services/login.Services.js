import User from "../../models/User.js";
import { redisClient } from "../../redis/testRedis.js";
import { comparePassword } from "../utils/comparePassword.js";
import { mySessionId } from "../utils/session.util.js";

export const userLogin = async(userData) =>{
    try{

    const {password,email,username} = userData;

    if (!password || (!email && !username)) {
        throw new Error("Not enough login credentials!");
    }
    const user = await User.findOne({
        $or: [{email},{username}]
    }).select("+password");
 
    if (!user){
        throw new Error("Invalid email or password");
    }
    const checkPass = await comparePassword(password,user.password);
    user.password = undefined;
    if(checkPass != true){
        throw new Error("Invalid email or password");
    }
 
    const sessionToken = await mySessionId();
    const userId = user._id.toString();
    redisClient.set(sessionToken,userId);
    return {
        user,
        sessionToken
    };
}
catch(error){
    throw new Error(error.message);
}
}