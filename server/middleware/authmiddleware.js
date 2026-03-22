import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Allow static superadmin without DB lookup
    if (decoded.role === "superadmin") {
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      return next();
    }

    // ✅ Normal users / owners check from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || user.isBlocked) {
      return res.status(401).json({ message: "User not authorized" });
    }

    req.user = {
      userId: user._id,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;