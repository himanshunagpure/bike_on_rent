import Bike from "../models/bike.js";
import User from "../models/user.js";

/* ===============================
   CREATE BIKE
=============================== */
export const createBike = async (req, res) => {
  try {
    const ownerId = req.user.userId;  // ✅ Fixed: was req.user.id
console.log("Owner ID:", ownerId);
    let {
      bikeName,
      bikeNumber,
      bikeType,
      brand,
      model,
      year,
      fuelType,
      transmission,
      engineCapacity,
      mileage,
      pricing,
      securityDeposit,
      availabilityType,
      calendar,
      weekly,
      location,
      bookingRules
    } = req.body;

    // ✅ Parse JSON strings from FormData
    if (typeof pricing === "string") pricing = JSON.parse(pricing);
    if (typeof location === "string") location = JSON.parse(location);
    if (typeof bookingRules === "string") bookingRules = JSON.parse(bookingRules);
    if (typeof weekly === "string") weekly = JSON.parse(weekly);

    // VALIDATION
    if (!bikeName || !bikeNumber || !pricing?.perHour || !pricing?.perDay) {
      return res.status(400).json({ message: "Missing required fields: bikeName, bikeNumber, pricing.perHour, pricing.perDay" });
    }

    if (!req.files?.rcBook || !req.files?.insurance || !req.files?.pollution) {
      return res.status(400).json({
        message: "RC Book, Insurance, and Pollution certificate files are required"
      });
    }

    // ✅ Process file uploads (mock URLs for now - integrate Cloudinary later)
    const documents = {
      rcBook: {
        url: `uploaded-${Date.now()}-rcbook`,
        validTill: req.body.rcValidTill || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      insurance: {
        url: `uploaded-${Date.now()}-insurance`,
        validTill: req.body.insuranceValidTill || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      pollution: {
        url: `uploaded-${Date.now()}-pollution`,
        validTill: req.body.pollutionValidTill || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    };

    const images = req.files?.images?.map(file => `uploaded-${Date.now()}-image`) || [];

    // AVAILABILITY
    let availability = {};

    if (availabilityType === "always") {
      availability = {
        type: "always",
        alwaysAvailable: true,
        calendar: []
      };
    } else {
      availability = {
        type: "calendar",
        alwaysAvailable: false,
        calendar: calendar || []
      };
    }

    const bike = await Bike.create({
      owner: ownerId,
      bikeName,
      bikeNumber,
      bikeType,
      brand,
      model,
      year,
      fuelType,
      transmission,
      engineCapacity,
      mileage,
      pricing,
      securityDeposit,
      availability,
      bookingRules,
      weekly,
      location,
      documents,
      images
    });

    res.status(201).json({
      success: true,
      message: "Bike created successfully",
      data: bike
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET ALL BIKES
=============================== */
export const getBikes = async (req, res) => {
  try {
    const { city, search, minPrice, maxPrice } = req.query;

    let query = {
      isDeleted: false,
      adminStatus: "approved"
    };

    if (city) query["location.city"] = city;

    if (search) query.$text = { $search: search };

    if (minPrice || maxPrice) {
      query["pricing.perDay"] = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) })
      };
    }

const bikes = await Bike.find(query)
Bike.find().populate("owner", "fullName email phone")
  .sort({ createdAt: -1 });

    res.json({ success: true, data: bikes });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET SINGLE BIKE
=============================== */
export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate("owner");

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.json({ success: true, data: bike });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   UPDATE BIKE
=============================== */
export const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    if (bike.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedBike });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   DELETE BIKE (SOFT)
=============================== */
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    if (bike.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    bike.isDeleted = true;
    await bike.save();

    res.json({ message: "Bike deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   CHECK AVAILABILITY
=============================== */
export const checkAvailability = async (req, res) => {
  try {
    const { bikeId, startTime, endTime } = req.body;

    const bike = await Bike.findById(bikeId);

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    if (bike.bookingLockUntil && bike.bookingLockUntil > new Date()) {
      return res.json({ available: false, message: "Locked" });
    }

    // ALWAYS AVAILABLE
    if (bike.availability.alwaysAvailable) {
      return res.json({ available: true });
    }

    // CALENDAR CHECK
    const isInside = bike.availability.calendar.some(slot =>
      new Date(startTime) >= new Date(slot.start) &&
      new Date(endTime) <= new Date(slot.end)
    );

    if (!isInside) {
      return res.json({ available: false, message: "Outside availability" });
    }

    // BLOCKED
    const isBlocked = bike.blockedDates.some(block =>
      new Date(startTime) < new Date(block.end) &&
      new Date(endTime) > new Date(block.start)
    );

    if (isBlocked) {
      return res.json({ available: false, message: "Already booked" });
    }

    res.json({ available: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   TOGGLE AVAILABILITY
=============================== */
export const toggleAvailability = async (req, res) => {
  try {
    const { type, calendar } = req.body;

    const bike = await Bike.findById(req.params.id);

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    if (bike.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (type === "always") {
      bike.availability = {
        type: "always",
        alwaysAvailable: true,
        calendar: []
      };
    } else {
      bike.availability = {
        type: "calendar",
        alwaysAvailable: false,
        calendar
      };
    }

    await bike.save();

    res.json({ message: "Availability updated", data: bike });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   BLOCK DATES (MANUAL)
=============================== */
export const blockDates = async (req, res) => {
  try {
    const { start, end } = req.body;

    const bike = await Bike.findById(req.params.id);

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    if (bike.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    bike.blockedDates.push({ start, end });
    await bike.save();

    res.json({ message: "Dates blocked successfully", data: bike });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   GET USER'S BIKES
=============================== */
export const getUserBikes = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const bikes = await Bike.find({ owner: ownerId, isDeleted: false })
      .sort({ createdAt: -1 });

    res.json({ success: true, bikes });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};