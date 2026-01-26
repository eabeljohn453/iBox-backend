import jwt from "jsonwebtoken"; 
const authMiddleware = (req, res, next) => {
  try {  
    const token = req.cookies.token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    req.user = {
      id: decoded.id,
    };
 
 next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
