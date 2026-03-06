import dotenv from "dotenv";
dotenv.config();   //  Load env FIRST

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Razorpay = require("razorpay");

import Booking from "../models/booking.js";
import crypto from "crypto";
import Payment from "../models/payment.js";

//  Create Razorpay instance ONCE
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Validation
    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const options = {
      amount: booking.amount.total * 100,
      currency: "INR",
      receipt: `booking_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // send key_id to frontend
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
   console.log("VERIFY PAYMENT API HIT");
    console.log("STEP 1 BODY:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      amount
    } = req.body;

    console.log("STEP 2 SIGNATURE VERIFY");

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("EXPECTED:", expectedSignature);
    console.log("RECEIVED:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature"
      });
    }

    console.log("STEP 3 SIGNATURE VERIFIED");

    // SAVE PAYMENT
    const payment = await Payment.create({
      booking: bookingId,
      transactionId: razorpay_payment_id,
      amount: amount,
      method: "upi",
      status: "success"
    });

    console.log("STEP 4 PAYMENT SAVED:", payment);

    // UPDATE BOOKING
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true }
    );

    console.log("STEP 5 BOOKING UPDATED:", booking);

    res.json({
      success: true,
      message: "Payment verified"
    });

  } catch (err) {

    console.error("FULL ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }
};