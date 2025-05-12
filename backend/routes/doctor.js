import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import Doctor from '../models/Doctor.js';
import DoctorApplication from '../models/DoctorApplication.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Middleware to verify admin (for approval endpoint)
// This is a simple example; in production, use proper admin authentication
const adminMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Admin access required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add logic to check if the user is an admin (e.g., decoded.role === 'admin')
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Doctor registration application
router.post('/register', upload.single('certificate'), async (req, res) => {
    const { name, clinicName, clinicAddress, phone, email, specialization, qualifications, password } = req.body;
    const certificate = req.file ? req.file.path : null;

    try {
        const existingApplication = await DoctorApplication.findOne({ email });
        if (existingApplication) {
            return res.status(400).json({ message: 'Application already submitted' });
        }

        const application = new DoctorApplication({
            name,
            clinicName,
            clinicAddress,
            phone,
            email,
            specialization,
            qualifications: JSON.parse(qualifications),
            certificate,
            password, // Save the password (will be hashed by the schema's pre-save hook)
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve doctor application (admin only)
router.post('/approve/:id', adminMiddleware, async (req, res) => {
    try {
        const application = await DoctorApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Application already processed' });
        }

        // Check if a Doctor entry already exists for this email
        const existingDoctor = await Doctor.findOne({ email: application.email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already registered' });
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
        application.status = 'approved';
        await application.save();

        res.json({ message: 'Doctor application approved successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Doctor login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await doctor.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            message: 'Login successful',
            token,
            doctorId: doctor._id,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;