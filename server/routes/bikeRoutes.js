import express from "express";
import multer from "multer";
import {
  createBike,
  getBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getUserBikes
} from "../controllers/bikeController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

/* ---------------- MULTER CONFIG ---------------- */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* ---------------- ROUTES ---------------- */

// CREATE BIKE (with files)
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "rcBook", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "pollution", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createBike
);

// GET ALL
router.get("/", getBikes);

// GET USER'S BIKES
router.get("/user/my", authMiddleware, getUserBikes);

// GET SINGLE
router.get("/:id", getBikeById);

// UPDATE (allow updating files also)
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "rcBook", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "pollution", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateBike
  
);
// DELETE
router.delete("/:id", authMiddleware, deleteBike);

export default router;