import { registerUser } from "../../services/user.Services.js";
import { authCookieOptions } from "../../utils/session.util.js";

export const signup  = async (req, res) => {
  try {

        const newUser = await registerUser(req.body);
        res.cookie('token',newUser.token,authCookieOptions);
        res.status(201).json(newUser);
    
  } catch (error) {
    res.status(400).json({
        message : error.message
    })
  }
};
