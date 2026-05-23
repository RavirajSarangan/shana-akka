const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Medication = require('../models/Medication');
const Routine = require('../models/Routine');
const HealthNote = require('../models/HealthNote');
const ElderFamilyLink = require('../models/ElderFamilyLink');
const Alert = require('../models/Alert');

// @route   GET api/family/elders
// @desc    Get all linked elders for a family user
// @access  Private (Family)
router.get('/elders', auth, async (req, res) => {
    try {
        const links = await ElderFamilyLink.find({
            familyId: req.user.id,
            consentStatus: 'Approved'
        }).populate('elderId', '-password');

        res.json(links.map(link => link.elderId));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/family/elders/:elderId/summary
// @desc    Get summary statistics for a specific elder
// @access  Private (Family)
router.get('/elders/:elderId/summary', auth, async (req, res) => {
    try {
        const { elderId } = req.params;

        // Check permission
        const link = await ElderFamilyLink.findOne({
            familyId: req.user.id,
            elderId,
            consentStatus: 'Approved'
        });

        if (!link) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const meds = await Medication.find({ elder: elderId });
        const routines = await Routine.find({ elder: elderId });
        const alerts = await Alert.find({ user: elderId }).sort({ createdAt: -1 }).limit(5);

        // Calculate summary from logs
        let medsTaken = 0;
        let medsMissed = 0;

        meds.forEach(med => {
            const lastLog = med.logs.length > 0 ? med.logs[med.logs.length - 1] : null;
            if (lastLog) {
                if (lastLog.status === 'Taken') medsTaken++;
                if (lastLog.status === 'Missed') medsMissed++;
            }
        });

        const routineDone = routines.filter(r => r.completed).length;
        const routinePercent = routines.length > 0 ? (routineDone / routines.length) * 100 : 0;

        res.json({
            medsTaken,
            medsMissed,
            medsDue: meds.length - medsTaken - medsMissed,
            routinePercent,
            recentAlerts: alerts,
            lastActivity: meds.length > 0 ? (meds[0].updatedAt || new Date()) : new Date()
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/family/notes
// @desc    Add a health note for an elder
// @access  Private (Family)
router.post('/notes', auth, async (req, res) => {
    try {
        const { elderId, title, content, noteType, visibility, priority } = req.body;

        const newNote = new HealthNote({
            elderId,
            authorId: req.user.id,
            title,
            content,
            noteType,
            visibility,
            priority
        });

        const note = await newNote.save();
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/family/notes/:elderId
// @desc    Get all health notes for an elder
// @access  Private (Family)
router.get('/notes/:elderId', auth, async (req, res) => {
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

// @route   POST api/family/link-request
// @desc    Request to link with an elder
// @access  Private (Family)
router.post('/link-request', auth, async (req, res) => {
    try {
        const { elderEmail } = req.body;
        const elder = await User.findOne({ email: elderEmail, role: 'Elder' });

        if (!elder) {
            return res.status(404).json({ msg: 'Elder not found' });
        }

        const existingLink = await ElderFamilyLink.findOne({
            familyId: req.user.id,
            elderId: elder._id
        });

        if (existingLink) {
            return res.status(400).json({ msg: 'Link request already exists' });
        }

        const newLink = new ElderFamilyLink({
            familyId: req.user.id,
            elderId: elder._id,
            consentStatus: 'Pending'
        });

        await newLink.save();
        res.json({ msg: 'Link request sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/family/pending-requests
// @desc    Get all pending link requests for an elder
// @access  Private (Elder)
router.get('/pending-requests', auth, async (req, res) => {
    try {
        const requests = await ElderFamilyLink.find({
            elderId: req.user.id,
            consentStatus: 'Pending'
        }).populate('familyId', 'name email');

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/family/respond-link/:id
// @desc    Approve or reject a link request
// @access  Private (Elder)
router.put('/respond-link/:id', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Revoked'
        const link = await ElderFamilyLink.findById(req.params.id);

        if (!link) {
            return res.status(404).json({ msg: 'Link request not found' });
        }

        if (link.elderId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        link.consentStatus = status;
        await link.save();

        // Create alert for family member
        const familyAlert = new Alert({
            user: link.familyId,
            title: `Link Request ${status}`,
            message: `${req.user.name} has ${status.toLowerCase()} your request to link accounts.`,
            type: 'System',
            severity: 'Medium'
        });
        await familyAlert.save();

        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/family/contacts
// @desc    Get linked family members for the current elder
// @access  Private (Elder)
router.get('/contacts', auth, async (req, res) => {
    try {
        const links = await ElderFamilyLink.find({
            elderId: req.user.id,
            consentStatus: 'Approved'
        }).populate('familyId', 'name email');

        res.json(links.map(link => link.familyId));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

