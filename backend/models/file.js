import mongoose, { mongo } from "mongoose";
const fileSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:String,
    url:String,
    publicId:String,
    size:Number,
    type:String
},{timestamps:true})
export default mongoose.model("File",fileSchema)