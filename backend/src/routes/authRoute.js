import express from "express";
import { signup, forgotPassword, passwordReset, updateProfile, login, checkAuth, logout } from "../controllers/authController.js";
import securityRoute from "../middleware/auth.middleware.js";
import validatingAdmin from "../middleware/adminMiddleware.js";
import adminSignin from "../controllers/adminController.js";
import validateSignup from "../middleware/userValidation.js";
import checkPasswordSecurity from "../middleware/password_check.middleware.js";

const router = express.Router();

// PUBLIC ROUTES - NO AUTHENTICATION REQUIRED
router.post("/signup", validateSignup, signup);
router.post("/login",login); // REMOVED securityRoute middleware
router.post("/logout",logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", passwordReset,checkPasswordSecurity);
router.post("/signin/admin", validatingAdmin, adminSignin);

// PROTECTED ROUTES - AUTHENTICATION REQUIRED
router.get("/verify-token",securityRoute,(req,res) =>{
    return res.status(200).json({
        message: 'valid token',
        user: req.user
    })
})
router.get("/check", securityRoute, checkAuth);
router.put("/update-profile", securityRoute, updateProfile);

export default router;