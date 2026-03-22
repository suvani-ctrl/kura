import { redisClient } from "../../../redis/testRedis.js";

export const deleteSessionId = async(req,res) =>{
    const sessionId = req.cookies?.sessionId;
    try{
        await redisClient.del(sessionId);
        res.clearCookie('sessionId');
        res.status(200).json({
            message: "Logged out successfuly"
        })
    }
    catch(error){
        res.status(500).json({
            message: "Server Error"
        })
    }
    }