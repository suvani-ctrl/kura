import { getchatPartners_ } from "../../repositories/Message.repo.js"

export const getChatPartners = async(req,res) =>{
    
    try {
        const userId = req.user._id.toString();
        const myChatPartners = await getchatPartners_(userId);
        res.status(200).json(myChatPartners);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            "message": "Internal Server Error"
        })
    }
}