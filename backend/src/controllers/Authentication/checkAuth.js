import User from "../../../models/User.js";
import { verifyToken } from "../../utils/jwt.util.js";

export const checkAuth = async (req, res) => {
    try {
        console.log("Cookies received:", req.cookies);
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = verifyToken(token);
        console.log("Decoded Token is here :", decoded);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
