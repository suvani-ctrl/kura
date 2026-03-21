import User from "../../models/User.js";
import { redisClient } from "../../redis/testRedis.js";
import { comparePassword } from "../utils/comparePassword.js";
import { authCookieOptions, generateToken } from "../utils/jwt.util.js";
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
    redisClient.set(sessionToken,user._id);
    return {
        user,
        sessionToken
    };
}
catch(error){
    throw new Error(error.message);
}
}