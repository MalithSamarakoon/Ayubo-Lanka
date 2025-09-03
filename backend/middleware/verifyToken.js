// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

/**
 * Reads JWT from:
 *  1) Authorization header: "Bearer <token>"
 *  2) Cookie: token
 * On success: sets req.user (full payload) and req.userId (id/userId) then next()
 */
function verifyToken(req, res, next) {
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
