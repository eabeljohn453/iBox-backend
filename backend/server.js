import express from "express"
import mongoose from "mongoose";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"
import connectDB from "./config/database.js";
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser());

const port = process.env.port || 5000
connectDB()
    .then(() => {
        console.log("mongo is connected")
        app.listen(port, () => {
            console.log(`server is running port ${port}`)
        })
    })
    .catch(err => console.error(err))
app.use("/api/auth", authRoutes)
app.use("/api/files", fileRoutes);
app.use("/api/dashboard", dashboardRoutes);

