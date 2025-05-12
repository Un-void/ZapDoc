import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    qualifications: [{
        degree: String,
        institution: String,
        year: Number,
    }],
    certificate: {
        type: String, // URL or path to stored file
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password for login
doctorSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('Doctor', doctorSchema);