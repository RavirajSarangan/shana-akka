const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const BrainGameScore = require('../models/BrainGameScore');

// @route   GET api/cognitive/scores
// @desc    Get current user's cognitive game scores
// @access  Private
router.get('/scores', auth, async (req, res) => {
    try {
        const scores = await BrainGameScore.find({ user: req.user.id }).sort({ playedAt: -1 });
        res.json(scores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/cognitive/score
// @desc    Save a cognitive game score
// @access  Private
router.post('/score', auth, async (req, res) => {
    try {
        const { gameType, score, level } = req.body;
        const newScore = new BrainGameScore({
            user: req.user.id,
            gameType,
            score,
            level
        });
        const savedScore = await newScore.save();
        res.json(savedScore);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
