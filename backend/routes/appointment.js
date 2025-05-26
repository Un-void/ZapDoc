import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

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
        // Find booked slots for this doctor on the provided date.
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

// Book an appointment
router.post('/book', async (req, res) => {
  const { doctorId, date, slot, userId } = req.body; // userId can come from req body or token if authenticated
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
      userId,
      date: new Date(date),
      slot,
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;