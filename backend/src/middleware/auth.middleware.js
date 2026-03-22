import User from "../../models/User.js";
import { redisClient } from "../../redis/testRedis.js";

const securityRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.sessionId;
        const redisUserId = redisClient.get(sessionId);
        console.log(token)
        console.log(redisUserId)
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token has been provided"

            });
        }


        const user = await User.findById(redisUserId).select("-password");
        
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found"
            });
        }
        
        req.user = user;
        console.log("User for debug:", req.user)
        next();
        
    } catch (error) {
        console.log("Error in security Route middleware:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default securityRoute;