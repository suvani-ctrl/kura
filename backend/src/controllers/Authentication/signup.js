import { registerUser } from "../../services/user.Services.js";

export const signup  = async (req, res) => {
  try {
        const newUser = await registerUser(req.body);
        res.status(201).json(newUser);
    
  } catch (error) {
    res.status(400).json({
        message : error.message
    })
  }
};
