import { validateAndHashPassword } from "../../utils/password.util.js";

export const passwordReset = async (req, res) => {
    const {token,userId} = req.body;
    let new_pass;
    
    try{
        if(!token || !userId){
            return res.status(400).json({
            success:false,
            message:"Token not found"
        })
        }
        const check_token = await Token.findOne({
            $and:[
                {token:token},
                {userId: userId}
            ]})
        if(!check_token){
            return res.status(400).send({
                success:false,
                message: "Invalid Token" 
            })}

        const {newPassword} = req.body;
        if(!newPassword){
            return res.status(400).send("Please insert a valid password");
        }
        new_pass = await validateAndHashPassword(newPassword);
        
       
        const update_password = await User.findByIdAndUpdate(
            userId,{
                password: new_pass
            }
        )
        
        if(!update_password){
            return res.status(404).json({
                success:false,
                message: "User not found or update failed"
            })
            }
        await Token.deleteOne({userId})

        return res.status(200).json({
            success: true,
            message: "Password reset done"
        })
}  
catch(error){
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Internal server error ! cant change the password"
        
    })

}

};