import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { welcomeEmailTemplate } from "./mailTemplate.js";
import { forgotPasswordTemplate } from "./mailTemplate.js";
dotenv.config();


const Token = process.env.MAILTRAP_TOKEN;

const transport = nodemailer.createTransport(
   {
    host: process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    auth:{
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
   }
);

const sender = {
    address:  process.env.MAIL_FROM_ADDRESS,
    name: process.env.MAIL_FROM_NAME,
};

const sendWelcomeEmail = async(email,fullname) =>{
    try {
        const info = await transport.sendMail({
            from : sender,
            to:email,
            subject: "Hello from myMessanger Team",
            text: `Hi ! ${fullname} , welcome to our application!`, 
            html: welcomeEmailTemplate(fullname)
        });
    console.log("email sentL:", info.messageId)
    } catch (error) {
        console.error("email failed:", error)
    }
}

export const sendEmailforForgotPassword = async(email,resetURL) =>{
        const info = await transport.sendMail({
            from:sender,
            to:email,
            subject: "Hello here is your email for forgotten password",
            html: forgotPasswordTemplate(resetURL)
        });
        console.log("email sent to forgot password")

        
}

export const sendEmailForResetPassword  = async(email,resetUrl) =>{
    const info = await transport.sendMail({
        from:sender,
        to:email,
        subject: "Hello from my Messanger Team",
        text: `Hi Here is your link for Password Reset`,
        html:forgotPasswordTemplate(resetUrl)
    });
    console.log("Email sent to reset password!")
}

export default sendWelcomeEmail;

