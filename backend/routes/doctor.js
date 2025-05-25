import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import Doctor from "../models/Doctor.js";
import DoctorApplication from "../models/DoctorApplication.js";
import bcrypt from "bcryptjs";
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Admin access required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Doctor registration application
router.post("/register", upload.single("certificate"), async (req, res) => {
  const {
    name,
    clinicName,
    clinicAddress,
    phone,
    email,
    specialization,
    qualifications,
    password,
  } = req.body;
  const certificate = req.file ? req.file.path : null;

  try {
    const existingApplication = await DoctorApplication.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({ message: "Application already submitted" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const application = await DoctorApplication.create({
      name,
      clinicName,
      clinicAddress,
      phone,
      email,
      specialization,
      qualifications: JSON.parse(qualifications),
      certificate,
      password: hashedPassword,
    });
    console.log(application.password);

    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve doctor application (admin only)
router.post("/approve/:id", adminMiddleware, async (req, res) => {
  try {
    const application = await DoctorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already processed" });
    }

    // Check if a Doctor entry already exists for this email
    const existingDoctor = await Doctor.findOne({ email: application.email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    // Create a new Doctor entry
    const doctor = new Doctor({
      name: application.name,
      email: application.email,
      password: application.password, // Use the hashed password from the application
      clinicName: application.clinicName,
      clinicAddress: application.clinicAddress,
      phone: application.phone,
      specialization: application.specialization,
      qualifications: application.qualifications,
      certificate: application.certificate,
    });

    await doctor.save();

    // Update application status
    application.status = "approved";
    await application.save();

    res.json({ message: "Doctor application approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reject doctor application (admin only)
router.post("/reject/:id", adminMiddleware, async (req, res) => {
  try {
    const application = await DoctorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already processed" });
    }
    application.status = "rejected";
    await application.save();
    res.json({ message: "Doctor application rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Doctor login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    console.log("Doctor found:", doctor);
    if (!doctor) {
      console.log("Doctor not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Stored hash password:", doctor.password);
    const isMatch = await bcrypt.compare(password, doctor.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      console.log("Password did not match");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Token generated");

    res.json({
      message: "Login successful",
      token,
      doctorId: doctor._id,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending applications (admin only)
router.get("/applications", adminMiddleware, async (req, res) => {
  try {
    const applications = await DoctorApplication.find({ status: "pending" });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
