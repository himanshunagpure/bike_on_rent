import express from "express";
import {
  createDamageReport,
  getDamageReports,
  getDamageByBooking,
  updateDamageStatus
} from "../controllers/damageReportController.js";

import upload from "../middleware/upload.js";


const router = express.Router();

/* ---------------------------------
   Bike Owner reports damage
----------------------------------*/
router.post(
  "/report",
  upload.array("damagePhotos", 5),
  createDamageReport
);

/* ---------------------------------
   Get all damage reports
----------------------------------*/
router.get("/", getDamageReports);

/* ---------------------------------
   Get damage report by booking
----------------------------------*/
router.get("/booking/:bookingId", getDamageByBooking);

/* ---------------------------------
   Update damage status
----------------------------------*/
router.patch("/:id/status", updateDamageStatus);


export default router;