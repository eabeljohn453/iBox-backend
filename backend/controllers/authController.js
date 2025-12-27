import User from "../models/user.js" 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken" 
export const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name,!email,!password){
            return res.status(400).json({message:"required all fields"})
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"email already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })
        res.status(201).json({message:"user created"})
    }
    catch(e){
        res.status(400).json({message:"error occured"})
    }
}
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email||!password){
            res.status(400).json({message:"type the required fields"})
        }
        const user=await User.findOne({email})
         if (!user)
      return res.status(400).json({ message: "Invalid credentials" });
        const match=await bcrypt.compare(password,user.password)
        if(!match){
            res.status(400).json({message:"wrong password"})
        }
        const token=jwt.sign(
            {id:user._id},                                                                                                                                                                                      
            process.env.JWT_SECRET,
            {expiresIn:"7D"}
        )
        res.json({
            token,
            user:{
                id:user._id,
                name:user.email,
                email:user.email
            }
        })
    }
    catch(e){
        console.log("errror occured",e)
    }
}
export const address=async(req,res)=>{
    try{
        console.log("useeerrrrr",req.user)
        const user=await User.findById(req.user.id).select("name email")
        res.json(user)
    }catch(e){
        console.log("error",e)
    }
}