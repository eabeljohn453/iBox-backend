import express from "express"
import { register,login, address } from "../controllers/authController.js"
import authMiddleware from "../middleware/auth.js"
const routes=express.Router()
routes.post("/register" ,register)
routes.post("/login" ,login)
routes.get("/get",authMiddleware,address)
export default routes