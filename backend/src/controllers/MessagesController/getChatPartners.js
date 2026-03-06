import { getchatPartners_ } from "../../repositories/Message.repo"

export const getChatPartners = async(req,res) =>{
    
    try {
        const myChatPartners = await getchatPartners_(req.user._id);
        res.status(200).json(myChatPartners);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            "message": "Internal Server Error"
        })
    }

    

}