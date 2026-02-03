import mongoose from "mongoose";
import validator from 'validator';
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";   
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true, //added the index 
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,

    },
    totalStorageUsed: {
        type: String,
        default: 0
    }
}, { timestamps: true })

userSchema.methods.getJWT = async function () {
    const user = this
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7D" })
    return token
}
userSchema.methods.validatePassword = async function(passwordByUser){
    const user = this
    const validate = await bcrypt.compare(passwordByUser ,user.password)
    return validate
}

export default mongoose.model("User", userSchema)