// middleware/verifyToken.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

<<<<<<< HEAD
export const verifyToken = async (req, res, next) => {
  try {
    // Check for token in cookies first
    let token = req.cookies?.token;
    
    // If not in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid.",
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};
=======
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized - no token provided" });
  try {
    const auth = req.headers?.authorization;
    let token = null;

    if (auth && auth.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
    }

    if (!token) {
      token = req.cookies?.token ?? null;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.userId = decoded.userId || decoded.id || decoded._id || null;

    return next();
  } catch (err) {
    const message =
      err?.name === "TokenExpiredError"
        ? "Token expired"
        : err?.name === "JsonWebTokenError"
        ? "Invalid token"
        : "Authentication failed";
    return res.status(401).json({ success: false, message });
  }
};

export default verifyToken;
>>>>>>> aec98d3a22f08de5b714e08766dae3575d78d779
