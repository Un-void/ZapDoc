import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;