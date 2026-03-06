import { getsingleChat_ } from "../../repositories/Message.repo"

export const getsingleChat = async(req,res) =>{

    try{
        const id1 = req.user._id;
        const id2 = req.params;
        const getaChat = await getsingleChat_(id1,id2);
        res.status(200).json({
            message : getaChat
        })
    }catch{
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}