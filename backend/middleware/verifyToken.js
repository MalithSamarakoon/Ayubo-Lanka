// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "unauthorized - no token provided" });
  try {
    // 1) Try Authorization header
    const auth = req.headers?.authorization;
    let token = null;

    if (auth && auth.startsWith("Bearer ")) {
      token = auth.split(" ")[1];
    }

    // 2) Fallback to cookie
    if (!token) {
      token = req.cookies?.token ?? null;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach claims
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
}

export default verifyToken;
