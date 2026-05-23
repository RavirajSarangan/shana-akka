const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
    elder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    time: {
        type: String, // e.g., '07:00'
    },
    date: {
        type: Date,
    },
    repeatType: {
        type: String,
        enum: ['once', 'daily', 'weekly'],
        default: 'once'
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    completed: {
        type: Boolean,
        default: false,
    },
    lastCompletedDate: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('Routine', RoutineSchema);
