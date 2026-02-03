import User from "../models/user.js"
import bcrypt from "bcryptjs";   
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name, !email, !password) {
            return res.status(400).json({ message: "required all fields" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({ message: "user created" })
    }
    catch (e) {
        res.status(400).json({ message: "error occured" })
    }
}
export const login = async (req, res) => {
    console.log("Login route hit! req.body =", req.body);
  try {
    console.log(req.body)
    const { email, password } = req.body;
    console.log("email",email,password)
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false  
    });

    return res.status(200).json({ message: "Login success" });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const address = async (req, res) => {
    try { 
        const user = await User.findById(req.user.id).select("name email")
        res.json(user)
    } catch (e) {
        console.log("error", e)
    }
}