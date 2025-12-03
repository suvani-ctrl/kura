import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique:true
    },
    username:{
        type: String,
        required: true 
    },
    password:{
        type:String,
        required:true,
        minlength: 6
    },
    profilePic:{
        type:String,
        
        default: ""
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default: "user"
    }
},{timestamps:true}
// this is going to add created at and updated at fields

)

const User = mongoose.model("User", userSchema)

export default User;