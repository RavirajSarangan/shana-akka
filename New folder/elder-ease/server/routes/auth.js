const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role,
        });

        await user.save();

        const payload = {
            id: user.id,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Log failed attempt
            const failLog = new Analytics({ action: 'Login Failed', category: 'Security', metadata: { email, reason: 'User not found' } });
            await failLog.save();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.status === 'Deactivated') {
            return res.status(403).json({ success: false, message: 'Account deactivated. Please contact administrator.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // Log failed attempt
            const failLog = new Analytics({ action: 'Login Failed', category: 'Security', metadata: { email, reason: 'Password mismatch' } });
            await failLog.save();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Log successful login
        const successLog = new Analytics({ user: user.id, action: 'Login Successful', category: 'Security' });
        await successLog.save();

        const payload = {
            id: user.id,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
const { auth } = require('../middleware/auth');
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/reset-password
// @desc    Reset password for Elder/Family Member
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: `This email is not associated with a ${role} account` });
        }

        if (user.role !== 'Elder' && user.role !== 'Family Member') {
            return res.status(403).json({ message: 'Password reset only allowed for Elder and Family Member accounts' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
