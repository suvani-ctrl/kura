import { userLogin } from "../../services/login.Services.js";
import { authCookieOptions } from "../../utils/jwt.util.js";
import { mySessionId } from "../../utils/session.util.js";

export const login = async (req, res) => {
    try {

        const {username,email,password} = req.body;
        const {user} = await userLogin({username,email,password});
        res.cookie(
            "sessionId":mySessionId,
            authCookieOptions
        )
        if(user){
        res.status(200).json({
            message: "Login Success",
            user:user
        })
        }
        else{
            res.status(404).json({
                message:"User not found!"
            })
        }
    }catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};