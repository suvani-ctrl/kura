import { getAllContactsController } from "../../repositories/Message.repo.js"

export const getAllContactsController = async(req,res) =>{
    try {
        const allContacts = await getAllContactsController(req.user.id);
        res.status(200).json(allContacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}