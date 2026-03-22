// isSuperAdmin.js
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};