import rateLimit from "express-rate-limit";

export const generalLimiter = () => {
  return rateLimit({ 
    windowMs: 1000,
    max: 100,
    message: "Limit reached too many requests",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip,
  });
};