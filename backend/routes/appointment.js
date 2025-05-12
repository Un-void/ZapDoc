// import express from 'express';
// import jwt from 'jsonwebtoken';
// import Appointment from '../models/Appointment.js';

// const router = express.Router();

// // Middleware to verify JWT token
// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'Please log in to continue' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Get available slots for a doctor
// router.get('/doctor/:doctorId', async (req, res) => {
//   const { doctorId } = req.params;
//   const { date } = req.query;
//   const slots = [
//     '09:00-10:00',
//     '10:00-11:00',
//     '11:00-12:00',
//     '12:00-13:00',
//     '13:00-14:00',
//     '14:00-15:00',
//     '15:00-16:00',
//     '16:00-17:00',
//   ];

//   try {
//     const bookedSlots = await Appointment.find({
//       doctorId,
//       date: new Date(date),
//       status: 'booked',
//     }).select('slot');

//     const availableSlots = slots.filter(
//       (slot) => !bookedSlots.some((booked) => booked.slot === slot)
//     );

//     res.json({ availableSlots });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Book an appointment
// router.post('/book', authMiddleware, async (req, res) => {
//   const { doctorId, date, slot } = req.body;
//   try {
//     const existingAppointment = await Appointment.findOne({
//       doctorId,
//       date: new Date(date),
//       slot,
//       status: 'booked',
//     });

//     if (existingAppointment) {
//       return res.status(400).json({ message: 'Slot already booked' });
//     }

//     const appointment = new Appointment({
//       doctorId,
//       userId: req.user.id,
//       date: new Date(date),
//       slot,
//     });

//     await appointment.save();
//     res.status(201).json({ message: 'Appointment booked successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get user's appointments
// router.get('/user', authMiddleware, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ userId: req.user.id });
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Cancel an appointment
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }
//     if (appointment.userId.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     appointment.status = 'cancelled';
//     await appointment.save();
//     res.json({ message: 'Appointment cancelled successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
import express from 'express';
import jwt from 'jsonwebtoken';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Please log in to continue' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get available slots for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query;
    const slots = [
        '09:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00',
    ];

    try {
        const bookedSlots = await Appointment.find({
            doctorId,
            date: new Date(date),
            status: 'booked',
        }).select('slot');

        const availableSlots = slots.filter(
            (slot) => !bookedSlots.some((booked) => booked.slot === slot)
        );

        res.json({ availableSlots });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get doctor's appointments (with pagination and filtering)
router.get('/appointments/doctor', authMiddleware, async (req, res) => {
    const { page = 1, limit = 10, date, status } = req.query;
    const query = { doctorId: req.user.id };

    if (date) {
        query.date = new Date(date);
    }
    if (status) {
        query.status = status;
    }

    try {
        const appointments = await Appointment.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ date: 1, slot: 1 });

        const total = await Appointment.countDocuments(query);

        res.json({
            appointments,
            totalPages: Math.ceil(total / limit),
            currentPage: page * 1,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Book an appointment
router.post('/book', authMiddleware, async (req, res) => {
    const { doctorId, date, slot } = req.body;
    try {
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date: new Date(date),
            slot,
            status: 'booked',
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const appointment = new Appointment({
            doctorId,
            userId: req.user.id,
            date: new Date(date),
            slot,
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's appointments
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel an appointment
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (appointment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        appointment.status = 'cancelled';
        await appointment.save();
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;