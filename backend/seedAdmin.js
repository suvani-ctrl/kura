import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import Admin from "./models/Admin.js"

dotenv.config()

async function seedAdmin(){
    try{ 

    await mongoose.connect(process.env.Mongo_URI).then(() =>
    {
        console.log("Connected to Mongodb");
    })
    const admin_existence = await Admin.findOne({role:"admin"});
    if(admin_existence){
        console.log("admin already exists");
        return process.exit(1)
    }

    const hashed_password = await bcrypt.hash(process.env.Admin_pass,10);

     await Admin.create({
      username: process.env.Admin_name,   // matches schema
      email: process.env.Admin_email,
      password: hashed_password,
      role: "admin",
      permissions: {
        delete_user: true,
        ban_user: true,
        warn_user: true,
        delete_post: true,
        view_logs: true,
        view_stats: true
      }
    });
    console.log("Admin created successfully")
    
    process.exit(0);
}catch(error){
console.error("error seeding admin", error);
process.exit(0)
}
}
seedAdmin();