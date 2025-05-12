import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
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
    specialization: {
        type: String,
        required: true,
    },
    qualifications: [{
        degree: String,
        institution: String,
        year: Number,
    }],
    certificate: {
        type: String, // URL or path to stored file
        default: null,
    },
    password: { // Added password field
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
doctorApplicationSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('DoctorApplication', doctorApplicationSchema);