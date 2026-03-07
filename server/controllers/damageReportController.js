import DamageReport from "../models/DamageReport.js";
import Booking from "../models/booking.js";

/* -----------------------------
   Create Damage Report
------------------------------*/
export const createDamageReport = async (req, res) => {
  try {
    const { bookingId, description, estimatedRepairCost } = req.body;

    const photos = req.files ? req.files.map(file => file.path) : [];

    // check booking exists
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const report = await DamageReport.create({
      booking: bookingId,
      reporter: req.user._id, // bike owner
      description,
      estimatedRepairCost,
      damagePhotos: photos
    });

    res.status(201).json({
      message: "Damage report submitted successfully",
      report
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* -----------------------------
   Get All Damage Reports
------------------------------*/
export const getDamageReports = async (req, res) => {
  try {

    const reports = await DamageReport.find()
      .populate("booking")
      .populate("reporter", "name email");

    res.json(reports);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* -----------------------------
   Get Damage Report by Booking
------------------------------*/
export const getDamageByBooking = async (req, res) => {
  try {

    const report = await DamageReport.findOne({
      booking: req.params.bookingId
    }).populate("reporter", "name email");

    if (!report) {
      return res.status(404).json({ message: "No damage report found" });
    }

    res.json(report);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* -----------------------------
   Update Damage Status
------------------------------*/
export const updateDamageStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const report = await DamageReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Damage report not found" });
    }

    res.json({
      message: "Damage report updated",
      report
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};