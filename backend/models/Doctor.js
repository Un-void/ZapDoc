import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  clinicName: {
    type: String,
    required: true,
  },
  clinicAddress: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: [
    {
      degree: String,
      institution: String,
      year: Number,
    },
  ],
  certificate: {
    type: String, // URL or path to stored file
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Doctor", doctorSchema);
