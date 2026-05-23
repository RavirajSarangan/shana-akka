const mongoose = require('mongoose');

const BrainGameScoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameType: {
        type: String,
        enum: ['MemoryMatch', 'WordScramble', 'Trivia'],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    level: Number,
    playedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BrainGameScore', BrainGameScoreSchema);
