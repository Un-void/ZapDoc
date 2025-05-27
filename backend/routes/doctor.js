import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import Doctor from "../models/Doctor.js";
import DoctorApplication from "../models/DoctorApplication.js";
import bcrypt from "bcryptjs";
const router = express.Router();

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

    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/approve/:id", adminMiddleware, async (req, res) => {
  try {
    const application = await DoctorApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already processed" });
    }

    const existingDoctor = await Doctor.findOne({ email: application.email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered" });
    }

    const doctor = new Doctor({
      name: application.name,
      email: application.email,
      password: application.password,
      clinicName: application.clinicName,
      clinicAddress: application.clinicAddress,
      phone: application.phone,
      specialization: application.specialization,
      qualifications: application.qualifications,
      certificate: application.certificate,
    });

    await doctor.save();

    application.status = "approved";
    await application.save();

    res.json({ message: "Doctor application approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({ token, doctorId: doctor._id, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/applications", adminMiddleware, async (req, res) => {
  try {
    const applications = await DoctorApplication.find({ status: "pending" });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const doctor = await Doctor.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;