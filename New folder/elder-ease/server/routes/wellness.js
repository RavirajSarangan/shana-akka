const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const WellnessContent = require('../models/WellnessContent');

// @route   GET api/wellness
// @desc    Get all active wellness content
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contents = await WellnessContent.find({ active: true }).sort({ createdAt: -1 });
        res.json(contents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/wellness
// @desc    Add new wellness content
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const newContent = new WellnessContent(req.body);
        const content = await newContent.save();
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/wellness/:id
// @desc    Update wellness content
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        let content = await WellnessContent.findById(req.params.id);
        if (!content) return res.status(404).json({ msg: 'Content not found' });

        content = await WellnessContent.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/wellness/:id
// @desc    Delete wellness content
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const content = await WellnessContent.findById(req.params.id);
        if (!content) return res.status(404).json({ msg: 'Content not found' });

        await WellnessContent.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Content removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
