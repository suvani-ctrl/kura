import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js"
import dotenv from "dotenv";
dotenv.config();

export const adminSignin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Admin not found" });
        console.log("Password typed:", password);
        
        const match = await bcrypt.compare(password, admin.password);
        console.log("Password match?", match);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET_ADMIN,
            { expiresIn: "1h" }
        );
        res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "strict", // CSRF protection
  maxAge: 60 * 60 * 1000 // 1 hour in ms
});

        res.status(200).json({
            message: "Admin logged in successfully",
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// res.clearCookie("jwt");
// res.json({ message: "Logged out" });

export default adminSignin