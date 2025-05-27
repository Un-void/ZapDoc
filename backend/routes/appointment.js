import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers?.cookie?.split("=")[1];

  if (!token) {
    console.log("No token provided in Authorization header");
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    req.userId = decoded.id; // Extract userId from token payload (id: user._id)
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Get available slots for a doctor (optional authentication)
router.get("/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;
  const slots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ];

  try {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const bookedSlots = await Appointment.find({
      doctorId,
      date: normalizedDate,
      status: "booked",
    }).select("slot");

    const availableSlots = slots.filter(
      (slot) => !bookedSlots.some((booked) => booked.slot === slot)
    );

    res.json({ availableSlots });
  } catch (err) {
    console.error("Fetch slots error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Book an appointment (requires authentication)
router.post("/book", authMiddleware, async (req, res) => {
  const { doctorId, date, slot } = req.body;
  const userId = req.userId; // From token

  try {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const validSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
    ];
    if (!validSlots.includes(slot)) {
      return res.status(400).json({ message: "Invalid slot" });
    }
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: normalizedDate,
      slot,
      status: "booked",
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = new Appointment({
      doctorId,
      userId,
      date: normalizedDate,
      slot,
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
