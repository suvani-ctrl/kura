import bcrypt from "bcrypt";
import zxcvbn from "zxcvbn";
import isPwned from "../lib/security.js";


export const validateAndHashPassword = async (password) =>{

if (password.length < 10) {
    throw new Error("Password length not satisfied");
}

const strength = zxcvbn(password);
    if (strength.score < 3) {
        throw new Error(`Password is too weak. ${strength.feedback.suggestions.join('.')}`);
        }

    if (await isPwned(password)) {
    throw new Error("Password found in data breaches");
    }

const hashedPassword = await bcrypt.hash(password, 10);

return hashedPassword;


}