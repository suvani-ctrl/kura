import { redisClient } from "../../../redis/testRedis.js";

export const deleteSessionId = (req,res) =>{
    const sessionId = req.cookies?.sessionId;
    try{
        redisClient.del(sessionId);
        res.clearCookie('sessionId');
    }
    catch(error){
        res.status(200).json({
            message: "Deleted all the cookie"
        })
    }
    }