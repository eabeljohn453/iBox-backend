import express from "express"
import { register,login, address } from "../controllers/authController.js"
import authMiddleware from "../middleware/auth.js"
import  generalLimiter  from "../middleware/limiter.js"
const routes=express.Router()
routes.post("/register" ,generalLimiter,register)
routes.post("/login" ,generalLimiter, login)
routes.get("/get",authMiddleware,address)
export default routes