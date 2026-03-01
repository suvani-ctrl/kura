import express from "express";
import securityRoute from "../middleware/auth.middleware.js";
import validatingAdmin from "../middleware/adminMiddleware.js";
import adminSignin from "../controllers/adminController.js";
import validateSignup from "../middleware/userValidation.js";
import checkPasswordSecurity from "../middleware/password_check.middleware.js";

import { signup } from "../controllers/Authentication/signup.js";
import { login } from "../controllers/Authentication/login.js";
import { passwordReset } from "../controllers/Authentication/passwordReset.js";
import { forgotPassword } from "../controllers/Authentication/forgotPassword.js";
import { updateProfile } from "../controllers/Authentication/updateProfile.js";
import { logout } from "../controllers/Authentication/logout.js";
import { checkAuth } from "../controllers/Authentication/checkAuth.js"; // Spell check: checkkAuth (Double k!)
// import { refreshToken } from "../controllers/Authentication/refreshToken.js";

const router = express.Router();

// PUBLIC ROUTES - NO AUTHENTICATION REQUIRED
router.post("/signup", validateSignup, signup);
router.post("/login",login);
// router.post("/refresh", refreshToken);
// REMOVED securityRoute middleware
router.post("/logout",securityRoute,logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",checkPasswordSecurity, passwordReset);
router.post("/signin/admin", adminSignin);

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