const express = require('express');
const HealthNote = require('../models/HealthNote');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   GET api/health-notes/:elderId
// @desc    Get health notes for an elder
// @access  Private
router.get('/:elderId', auth, async (req, res) => {
    try {
        const notes = await HealthNote.find({ elderId: req.params.elderId })
            .populate('authorId', 'name')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/health-notes
// @desc    Add a health note
// @access  Private
router.post('/', auth, async (req, res) => {
    const { content, category, elderId } = req.body;

    try {
        const newNote = new HealthNote({
            elderId,
            authorId: req.user.id,
            content,
            title: req.body.title || 'Care Note',
            noteType: req.body.noteType || (req.body.category || 'Observation'),
            visibility: req.body.visibility || 'FamilyMember',
            priority: req.body.priority || 'Medium'
        });

        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
