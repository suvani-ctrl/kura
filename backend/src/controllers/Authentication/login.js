import { userLogin } from "../../services/login.Services.js";
import { authCookieOptions } from "../../utils/jwt.util.js";

export const login = async (req, res) => {
    try {

        const {username,email,password} = req.body;
        const {user,token} = await userLogin({username,email,password});
        res.cookie(
            "token",token,
            authCookieOptions
        )
        if(user){
        res.status(200).json({
            message: "Login Success",
            user:user
        })
    }
    
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};