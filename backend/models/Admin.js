import mongoose from "mongoose"
const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true 
    },
    password:{
        type: String,
        required:true,
        minlength: 9
    },
     profilePic:{
        type:String,
        default: ""
    },
    permissions: {
    delete_user: {type: Boolean, default: false},
    ban_user: {type: Boolean, default:false},
    warn_user: {type:Boolean, default: false},
    delete_post: {type:Boolean, default: false},
    view_logs: {type:Boolean, default:false},
    view_stats: {type:Boolean, default:false}
},
role: { type: String, default: "admin" }


}, {timestamps: true}) 

const Admin = mongoose.model("Admin", adminSchema)
export default Admin;