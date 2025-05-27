import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Routes
import userRoutes from "./routes/user.js";
import contactRoutes from "./routes/contact.js";
import appointmentRoutes from "./routes/appointment.js";
import doctorRoutes from "./routes/doctor.js"; // Added doctor routes

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to handle multipart form data for file uploads

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);

// Basic route to test the server
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
