import {connectDB} from "../src/lib/db.js"
import {removeNull} from "./20260308093922_remove_null_fields.js"
import mongoose from "mongoose";

export const migration = async() =>{
    try{
        await connectDB();
        await removeNull(mongoose.connection.db);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
await migration();