import mongoose,{Schema} from "mongoose"
import Joi from 'joi'

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:false
    },
    text:{
        type:String    },
    image:{
        type:String,
        default:undefined
    },
    file:{
        type:String,
        default: undefined
    },
    isRead: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
        required:false
},
notification:{
    type:Schema.Types.ObjectId,
    ref:"Notification"
}

},

{timestamps: true}
)

const messageValidation = Joi.object({
    senderId: Joi.string().required(),
    receiverId: Joi.string(),
    text:Joi.string().max(1000),
    image: Joi.string().uri(),
})



const Message = mongoose.model("Message",messageSchema);
export default Message;