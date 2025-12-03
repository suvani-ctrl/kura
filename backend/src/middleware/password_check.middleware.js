import bcrypt from "bcrypt"
import zxcvbn from 'zxcvbn';
import isPwned from '../lib/security.js';
import { ENV } from '../lib/env.js';


const checkPasswordSecurity = async (req, res, next) => {
    const { newPassword } = req.body; 
    
    if (!newPassword || newPassword.length < 10) {
        return res.status(400).send({
            message: "The password field is empty or less than 10 characters."
        });
    }

    const strength = zxcvbn(newPassword);
    if (strength.score < 3) {
        return res.status(400).send({
            message: "Password is too weak.",
            suggestions: strength.feedback.suggestions
        });
    }

    const pwned = await isPwned(newPassword);
    if (pwned) {
        return res.status(400).send({
            message: "This password has been found in known data breaches. Please choose another."
        });
    }
    try{
        const newlyhashedPassword = await bcrypt.hash(newPassword,10);
        req.hashedPassword = newlyhashedPassword;
        next();
    }catch(error){
        console.error("hashing failed", error);
        return res.status(500).send({message : "Internal server error"})
    }
};

export default checkPasswordSecurity