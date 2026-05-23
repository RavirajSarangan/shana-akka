const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String }, // For text-based stories
    category: { type: String, required: true },
    duration: { type: String }, // e.g., '5 min read'
    language: { type: String, default: 'English' },
    imageUrl: { type: String },
    pdfUrl: { type: String }, // For PDF-based stories
    audioUrl: { type: String }, 
    narrationEnabled: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);
