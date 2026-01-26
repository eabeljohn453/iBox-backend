import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();  

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log(
  "Cloudinary config:",
  process.env.MONGO_URI,
  process.env.CLOUDINARY_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET ? "SECRET_OK" : "SECRET_MISSING"
);


export default cloudinary;
