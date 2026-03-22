import express from "express";
// import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getPendingBikes,
  approveBike,
  rejectBike,
  getDashboardStats,
  getAllBikes,
  getOwnersWithBikes
} from "../controllers/superadminController.js";

import authMiddleware from "../middleware/authmiddleware.js";
import {isSuperAdmin} from "../middleware/isSuperAdmin.js";

const router = express.Router();
const SUPERADMIN = {
  email: "superadmin@123.com",
  password: "123456",
  fullName: "Super Admin"
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== SUPERADMIN.email || password !== SUPERADMIN.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: "superadmin-id", role: "superadmin" },
    process.env.JWT_SECRET || "supersecret123",
    { expiresIn: "7d" }
  );

  res.json({ token, fullName: SUPERADMIN.fullName });
  });


router.get("/pending-bikes", authMiddleware, isSuperAdmin, getPendingBikes);

router.put("/approve-bike/:id", authMiddleware, isSuperAdmin, approveBike);

router.put("/reject-bike/:id", authMiddleware, isSuperAdmin, rejectBike);
router.get("/dashboard-stats", authMiddleware, isSuperAdmin, getDashboardStats);
router.get("/all-bikes", authMiddleware, isSuperAdmin, getAllBikes);
// router.get("/all-owners", authMiddleware, isSuperAdmin, getAllOwners);
router.get("/owners-with-bikes", authMiddleware, isSuperAdmin, getOwnersWithBikes);

export default router;