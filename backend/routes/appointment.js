import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers?.cookie?.split("=")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id; // Accept both userId and id
    req.role = decoded.role; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

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
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (req.userId !== userId && req.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const appointments = await Appointment.find({ userId })
      .populate("doctorId", "name specialization clinicName clinicAddress")
      .lean();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/doctor/:doctorId/appointments", authMiddleware, async (req, res) => {
  const { doctorId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    if (req.userId !== doctorId && req.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const appointments = await Appointment.find({ doctorId })
      .populate("userId", "name email")
      .lean();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/book", authMiddleware, async (req, res) => {
  const { doctorId, date, slot } = req.body;
  const userId = req.userId; 

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
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/cancel/:appointmentId", authMiddleware, async (req, res) => {
  const { appointmentId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointmentId" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== req.userId && appointment.doctorId.toString() !== req.userId && req.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to cancel this appointment" });
    }

    if (appointment.status !== "booked") {
      return res.status(400).json({ message: "Appointment cannot be cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;