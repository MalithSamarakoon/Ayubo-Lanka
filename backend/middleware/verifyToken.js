// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  try {
    // Authorization: Bearer <token>
    const auth = req.headers?.authorization;
    let token = null;

    if (auth?.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
    }

    // Fallback: cookie "token"
    if (!token) {
      token = req.cookies?.token || null;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
