import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const validatingAdmin = (req, res, next) => {
    try {
        const adminToken = req.cookies.jwt; // or req.headers.authorization

        if (!adminToken) {
            return res.status(403).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_ADMIN);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied: not an admin" });
        }

        req.admin = { id: decoded.adminId, role: decoded.role };

        next(); 
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default validatingAdmin;
