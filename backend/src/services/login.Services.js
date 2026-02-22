import User from "../../models/User.js";
import { comparePassword } from "../utils/comparePassword.js";
import { authCookieOptions, generateToken } from "../utils/jwt.util.js";

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

    const token = generateToken({ userId: user._id, role: user.role });

    return {
        user,
        token
    };
}
catch(error){
    throw new Error(error.message);
}
}