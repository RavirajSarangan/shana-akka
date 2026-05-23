const mongoose = require('mongoose');

const WellnessContentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Music', 'Story', 'Exercise'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, // URL for music/video, text for story
        required: true
    },
    description: String,
    thumbnail: String,
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WellnessContent', WellnessContentSchema);
