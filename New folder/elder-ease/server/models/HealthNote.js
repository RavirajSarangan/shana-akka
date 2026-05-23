const mongoose = require('mongoose');

const HealthNoteSchema = new mongoose.Schema({
    elderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Care Note'
    },
    content: {
        type: String,
        required: true
    },
    noteType: {
        type: String,
        enum: ['Observation', 'Medication', 'Mood', 'Emergency', 'Routine', 'General', 'Medical', 'Appointment'],
        default: 'Observation'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    visibility: {
        type: String,
        enum: ['FamilyOnly', 'DoctorVisible', 'CaregiverVisible', 'SharedWithElder', 'FamilyMember', 'Elder', 'Both'],
        default: 'FamilyMember'
    },
    attachmentUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HealthNote', HealthNoteSchema);
