import User from "../../models/User.js";
import { validateAndHashPassword } from "../utils/password.util.js";
import { cleanEmail } from "../utils/email.util.js";
import { emailExists } from "../repositories/email.repo.js";
import { isValidEmail } from "../utils/email.util.js";
import sendWelcomeEmail from "../email/mailTrap.js";
import { mySessionId } from "../utils/session.util.js";
import { redisClient } from "../../redis/testRedis.js";


export const registerUser = async(userData) =>{
      try {
    
            const { email, password, username, profilePic } = userData;
    
            if (!email || !username || !password) {
                throw new Error("Insufficient data provided");
            }
    
            const clean_user = username.trim();
            const clean_email = cleanEmail(email); 


            if(!isValidEmail(clean_email)){
                throw new Error("Email field error");
                
            } 
            
            const existingEmail = await emailExists(clean_email);
    
            if(existingEmail){
                throw new Error("Email already exists");
            }
         
            const securePassword = await validateAndHashPassword(password);
    
            const newUser = await User.create({
                email: clean_email,
                password: securePassword,
                username: clean_user,
                profilePic
            });
    
            try {
                await sendWelcomeEmail(newUser.email, newUser.username);
            } catch (error) {
                console.error("Email sending failed:", error);
            }
            
            const data = ({
                user: {
                    _id: newUser.id,
                    username: newUser.username,
                    email: newUser.email 
                }
            })

            const sessionId = await mySessionId();
            
            await redisClient.set(sessionId,newUser._id.toString());

            return (
                {
                    ...data,
                    sessionId                }
                
            )
    
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
}