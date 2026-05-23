const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true
    },
    category: {
        type: String, // e.g., 'Wellness', 'Game', 'Medication'
        required: true
    },
    metadata: Object,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
