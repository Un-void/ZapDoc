// import express from 'express';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());

// // Routes
// import userRoutes from './routes/user.js';
// import contactRoutes from './routes/contact.js';
// import appointmentRoutes from './routes/appointment.js';

// app.use('/api/users', userRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/appointments', appointmentRoutes);

// // Basic route to test the server
// app.get('/', (req, res) => {
//   res.send('Backend server is running!');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Routes
import userRoutes from './routes/user.js';
import contactRoutes from './routes/contact.js';
import appointmentRoutes from './routes/appointment.js';
import doctorRoutes from './routes/doctor.js'; // Added doctor routes

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to handle multipart form data for file uploads

// Routes
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes); // Mounted doctor routes

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 (console.log(`Server running on port ${PORT}`));
});