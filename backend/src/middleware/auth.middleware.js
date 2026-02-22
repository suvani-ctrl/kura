import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { ENV } from "../lib/env.js";

const securityRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token has been provided"

            });
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        console.log("Decoded payload :",decoded);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }

        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found"
            });
        }
        
        req.user = user;
        console.log("User for debug:", req.user)
        next();
        
    } catch (error) {
        if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error.name)) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }
        console.log("Error in security Route middleware:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default securityRoute;