import cloudinary from "../config/cloudinary.js";
import File from "../models/file.js";
import { getFileType } from "../utils/fileType.js";
export const uploadFile=async(req,res)=>{
    try{
        if (!req.file) {
  return res.status(400).json({ message: "no file provided" });
}
 const isPdf = req.file.mimetype === "application/pdf";
        const result=await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream(
                {
                    folder:"storage_app",
                    resource_type: isPdf ? "raw" : "auto",
                },
                (err,result)=>{
                    if(err) reject(err);
                    else resolve(result);
                }
            ).end(req.file.buffer)
        })
        const savedFile=await File.create({
            userId:req.user.id,
            name:req.file.originalname,
            url:result.secure_url,
            publicId:result.public_id,
            size:result.bytes,
            type:getFileType(req.file.mimetype)
        })
        return res.status(201).json(savedFile)
    }
    catch(e){
        console.error(e)
         return res.status(500).json({ message: "Upload failed" });
    }
}
export const getImages=async(req,res)=>{
    try{
        const page=Number(req.query.page)||1
        const limit=Number(req.query.limit)||10
        const skip=(page-1)*10
        const images=await File.find({
            userId:req.user.id,
            type:"image",
        }).sort({createdAt:-1})
        .limit(limit)
        .skip(skip)
        const formatted=images.map((file)=>({
            _id:file._id,
            name:file.name,
            url:file.url,
            size:file.size,
            date:file.createdAt
        }))
        res.json(formatted)
    }
    catch(e){
        console.log("error occured",e)
    }
}
export const getvideo=async(req,res)=>{
    try{
        const video=await File.find({
            userId:req.user.id,
            type:"viau",
        }).sort({createdAt:-1});
        const formatted=video.map((file)=>({
            _id:file._id,
            name:file.name,
            url:file.url,
            size:file.size,
            date:file.createdAt
        }))
        res.json(formatted)
    }
    catch(e){
        console.log("error occured",e)
    }
}
export const getFile=async(req,res)=>{
    try{
        const Files=await File.find({
            userId:req.user.id,
            type:"document",
        }).sort({createdAt:-1});
        const formatted=Files.map((file)=>({
            _id:file._id,
            name:file.name,
            url:file.url,
            size:file.size,
            date:file.createdAt
        }))
        res.json(formatted)
    }
    catch(e){
        console.log("error occured",e)
    }
}
export const getOther=async(req,res)=>{
    try{
        const others=await File.find({
            userId:req.user.id,
            type:"other",
        }).sort({createdAt:-1});
        const formatted=others.map((file)=>({
            _id:file._id,
            name:file.name,
            url:file.url,
            size:file.size,
            date:file.createdAt
        }))
        res.json(formatted)
    }
    catch(e){
        console.log("error occured",e)
    }
}
