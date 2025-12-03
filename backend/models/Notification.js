import mongoose from "mongoose"
import User from "./User";
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    readAt:{
        type:Date,
        required:true,
        default:Date.now(),
        ref:User
    }
})

module.exports = {
    Notification: mongoose.model("Notification", NotificationSchema)
}