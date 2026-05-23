const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Analytics = require('../models/Analytics');

// @route   POST api/analytics/log
// @desc    Log a user action
// @access  Private
router.post('/log', auth, async (req, res) => {
    try {
        const { action, category, metadata } = req.body;
        const log = new Analytics({
            user: req.user.id,
            action,
            category,
            metadata
        });
        await log.save();
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/analytics/summary
// @desc    Get analytics summary for admin
// @access  Private (Admin)
router.get('/summary', auth, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const totalActions = await Analytics.countDocuments();
        const actionByCategory = await Analytics.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        const recentActivity = await Analytics.find().sort({ timestamp: -1 }).limit(20).populate('user', 'name role');

        res.json({
            totalActions,
            actionByCategory,
            recentActivity
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
