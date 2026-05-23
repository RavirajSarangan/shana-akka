const mongoose = require('mongoose');

const MemoryWallSchema = new mongoose.Schema({
    elder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    contentUrl: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['Image', 'Video'],
        default: 'Image'
    },
    caption: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    flagCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MemoryWall', MemoryWallSchema);
