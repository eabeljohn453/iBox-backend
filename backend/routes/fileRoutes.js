import express from "express";
import upload from "../middleware/upload.js";
import { getFile, getImages, getOther, getvideo, uploadFile } from "../controllers/fileController.js"; 
import authMiddleware from "../middleware/auth.js"; 
import { deleteFile, rename } from "../controllers/handleController.js";
const router = express.Router(); 
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/images",authMiddleware,getImages)
router.get("/document",authMiddleware,getFile)
router.get("/other",authMiddleware,getOther)
router.get("/videos",authMiddleware,getvideo)
router.patch("/:id/rename",authMiddleware,rename)
router.delete("/:id",authMiddleware,deleteFile)
export default router;
