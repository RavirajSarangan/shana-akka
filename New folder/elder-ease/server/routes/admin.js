const express = require('express');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Medication = require('../models/Medication');
const ElderFamilyLink = require('../models/ElderFamilyLink');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', auth, authorize('Admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/admin/users/:id
// @desc    Update user (Name, Role, Password, etc.)
// @access  Private (Admin)
router.put('/users/:id', auth, authorize('Admin'), async (req, res) => {
    const { role, name, password, status, email, profilePicture } = req.body;
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (role) user.role = role;
        if (name) user.name = name;
        if (email) user.email = email;
        if (status) user.status = status;
        if (profilePicture) user.profilePicture = profilePicture;
        
        // Only set password if it is provided and not empty
        if (password && password.trim().length > 0) {
            user.password = password; 
        }

        await user.save();
        res.json({ message: 'User updated successfully', user: { id: user._id, status: user.status } });
    } catch (err) {
        console.error("Admin user update error:", err);
        res.status(400).json({ message: err.message || 'Update failed' });
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', auth, authorize('Admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/admin/stats
// @desc    Get detailed system stats for dashboard
// @access  Private (Admin)
router.get('/stats', auth, authorize('Admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const elderCount = await User.countDocuments({ role: 'Elder' });
        const familyCount = await User.countDocuments({ role: 'Family Member' });

        // Alerts Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const alertsToday = await Alert.countDocuments({ createdAt: { $gte: startOfDay } });
        const emergenciesToday = await Alert.countDocuments({
            type: 'Emergency',
            createdAt: { $gte: startOfDay }
        });
        const missedMedsToday = await Alert.countDocuments({
            type: 'Medication',
            message: /missed/i,
            createdAt: { $gte: startOfDay }
        });

        const medicationCount = await Medication.countDocuments();

        // System Health info
        const systemHealth = {
            uptime: process.uptime(),
            memory: process.memoryUsage().heapUsed / 1024 / 1024, // MB
            status: 'Operational'
        };

        res.json({
            users: {
                total: totalUsers,
                elders: elderCount,
                family: familyCount
            },
            alerts: {
                totalToday: alertsToday,
                emergencies: emergenciesToday,
                missedMeds: missedMedsToday
            },
            medications: medicationCount,
            system: systemHealth
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/admin/links
// @desc    Get all link requests
// @access  Private (Admin)
router.get('/links', auth, authorize('Admin'), async (req, res) => {
    try {
        const links = await ElderFamilyLink.find()
            .populate('elderId', 'name email')
            .populate('familyId', 'name email');
        res.json(links);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   PUT api/admin/links/:id
// @desc    Approve/Reject link
// @access  Private (Admin)
router.put('/links/:id', auth, authorize('Admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const link = await ElderFamilyLink.findById(req.params.id);
        if (!link) return res.status(404).json({ msg: 'Link not found' });

        link.consentStatus = status;
        await link.save();
        res.json(link);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
