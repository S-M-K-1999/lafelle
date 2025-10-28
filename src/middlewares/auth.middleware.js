import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Verify JWT
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Verify admin
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
};

// ✅ Verify main user (super admin)
export const verifyMainUser = (req, res, next) => {
  if (req.user && req.user.email === process.env.MAIN_ADMIN_EMAIL) {
    return next();
  }
  return res.status(403).json({ message: "Only main admin can perform this action" });
};
