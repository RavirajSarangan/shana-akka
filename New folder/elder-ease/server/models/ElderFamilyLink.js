const mongoose = require('mongoose');

const ElderFamilyLinkSchema = new mongoose.Schema({
    elderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissions: {
        viewMeds: { type: Boolean, default: true },
        viewRoutines: { type: Boolean, default: true },
        viewNotes: { type: Boolean, default: true },
        receiveAlerts: { type: Boolean, default: true }
    },
    consentStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Revoked'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ElderFamilyLink', ElderFamilyLinkSchema);
