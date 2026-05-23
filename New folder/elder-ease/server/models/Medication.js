const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    elder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    frequency: {
        type: String, // e.g., 'Daily', 'Twice a day'
        required: true,
        default: 'Daily'
    },
    timings: [{
        type: String, // e.g., '08:00', '20:00'
    }],
    instructions: {
        type: String,
    },
    logs: [{
        date: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Taken', 'Missed'],
            required: true,
        },
        takenAt: {
            type: Date,
        },
    }],
    active: {
        type: Boolean,
        default: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    refillThreshold: {
        type: Number,
        default: 5,
    },
});

module.exports = mongoose.model('Medication', MedicationSchema);
