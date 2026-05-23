const express = require('express');
const Alert = require('../models/Alert');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   GET api/alerts
// @desc    Get alerts for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let query = { user: req.user.id };
        if (req.user.role === 'Admin') {
            query = {}; // Admins see everything
        }
        const alerts = await Alert.find(query).populate('user', 'name').sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/alerts/:id/read
// @desc    Mark alert as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        if (alert.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        alert.read = true;
        await alert.save();
        res.json(alert);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/alerts
// @desc    Create a new alert
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, message, type, severity, location } = req.body;
        const newAlert = new Alert({
            user: req.user.id,
            title,
            message,
            type,
            severity,
            location
        });

        const alert = await newAlert.save();
        res.json(alert);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/alerts/sos
// @desc    Trigger emergency SOS alert
// @access  Private
router.post('/sos', auth, async (req, res) => {
    try {
        const { location } = req.body;
        const newAlert = new Alert({
            user: req.user.id,
            title: 'EMERGENCY SOS',
            message: 'Elder has triggered an emergency alert!',
            type: 'Safety',
            severity: 'Critical',
            location
        });

        const alert = await newAlert.save();
        res.json(alert);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/alerts/:id
// @desc    Delete/Dismiss an alert
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) return res.status(404).json({ message: 'Alert not found' });
        
        if (req.user.role !== 'Admin' && alert.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete' });
        }
        
        await Alert.findByIdAndDelete(req.params.id);
        res.json({ message: 'Alert deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
