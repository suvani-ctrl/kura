import { redisClient } from "../../../redis/testRedis.js";

export const deleteSessionId = async(req,res) =>{
    const sessionId = req.cookies?.sessionId;
    try{
        await redisClient.del(sessionId);
        res.clearCookie('sessionId');
    }
    catch(error){
        res.status(200).json({
            message: "Deleted all the cookie"
        })
    }
    }