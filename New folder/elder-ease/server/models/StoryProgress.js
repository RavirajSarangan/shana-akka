const mongoose = require('mongoose');

const StoryProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    isFavorite: { type: Boolean, default: false },
    lastPage: { type: Number, default: 1 },
    lastReadAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StoryProgress', StoryProgressSchema);
