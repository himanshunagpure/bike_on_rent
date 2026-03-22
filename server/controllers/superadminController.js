import Bike from "../models/bike.js";
import User from "../models/user.js";

/* ===============================
   ADMIN DASHBOARD STATS
================================ */
export const getDashboardStats = async (req, res) => {
  try {

    const totalBikes = await Bike.countDocuments();

    const pendingBikes = await Bike.countDocuments({
      adminStatus: "pending"
    });

    const approvedBikes = await Bike.countDocuments({
      adminStatus: "approved"
    });

    const rejectedBikes = await Bike.countDocuments({
      adminStatus: "rejected"
    });

    const totalOwners = await User.countDocuments({
      role: "owner"
    });

    // Bikes added in last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const bikesLastWeek = await Bike.countDocuments({
      createdAt: { $gte: last7Days }
    });

    res.json({
      totalBikes,
      pendingBikes,
      approvedBikes,
      rejectedBikes,
      totalOwners,
      bikesLastWeek
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats"
    });
  }
};


/* ===============================
   GET PENDING BIKES
================================ */
export const getPendingBikes = async (req, res) => {
  try {

    const bikes = await Bike.find({ adminStatus: "pending" })
      .populate("owner", "fullName email phone location")
      .sort({ createdAt: -1 });

    res.json(bikes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   GET ALL BIKES
================================ */
export const getAllBikes = async (req, res) => {
  try {

    const bikes = await Bike.find({ isDeleted: false })
      .populate("owner", "fullName email phone");

    res.json(bikes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ===============================
   GET ALL OWNERS
================================ */
// export const getAllOwners = async (req, res) => {
//   try {

//     const owners = await User.find({
//       role: "owner"
//     });

//     res.json(owners);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });

//   }
// };


/* ===============================
   APPROVE BIKE
================================ */
export const approveBike = async (req, res) => {
  try {

    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { adminStatus: "approved" },
      { new: true }
    );

    if (!bike) {
      return res.status(404).json({
        message: "Bike not found"
      });
    }

    res.json({
      message: "Bike approved successfully",
      bike
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ===============================
   REJECT BIKE
================================ */
export const rejectBike = async (req, res) => {
  try {

    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { adminStatus: "rejected" },
      { new: true }
    );

    if (!bike) {
      return res.status(404).json({
        message: "Bike not found"
      });
    }

    res.json({
      message: "Bike rejected successfully",
      bike
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

export const getOwnersWithBikes = async (req, res) => {
  try {

    const bikes = await Bike.find({ isDeleted: false })
      .populate("owner", "fullName email phone")
      .sort({ createdAt: -1 });

    res.json(bikes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};