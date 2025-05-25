import mongoose from 'mongoose';


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
        type: String, 
        default: null,
    },
    password: { 
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

export default mongoose.model('DoctorApplication', doctorApplicationSchema);