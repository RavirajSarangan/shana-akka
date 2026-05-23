const express = require('express');
const Routine = require('../models/Routine');
const ElderFamilyLink = require('../models/ElderFamilyLink');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET api/routines
// @desc    Get all routines (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Elder') {
            query.elder = req.user.id;
        }

        let routines = await Routine.find(query).sort({ time: 1 });

        // Reset routines that were completed on previous days
        const today = new Date().toDateString();
        const updates = routines.map(async (routine) => {
            if (routine.completed && routine.lastCompletedDate) {
                const completedDate = new Date(routine.lastCompletedDate).toDateString();
                if (completedDate !== today) {
                    routine.completed = false;
                    await routine.save();
                }
            }
            return routine;
        });

        routines = await Promise.all(updates);

        res.json(routines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/routines
// @desc    Create a routine
// @access  Private (Family Member or Admin)
router.post('/', auth, authorize('Family Member', 'Admin'), async (req, res) => {
    const { title, description, time, elderId, date, repeatType } = req.body;

    try {
        // Validate title
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Routine title is required' });
        }

        // Validate elderId
        if (!elderId) {
            return res.status(400).json({ message: 'Elder ID is required' });
        }

        // Family members must have permission to add routines for the elder
        if (req.user.role === 'Family Member') {
            const familyLink = await ElderFamilyLink.findOne({
                elderId: elderId,
                familyId: req.user.id,
                consentStatus: 'Approved',
                'permissions.viewRoutines': true
            });

            if (!familyLink) {
                return res.status(403).json({ message: 'You do not have permission to add routines for this elder' });
            }
        }

        const newRoutine = new Routine({
            elder: elderId,
            createdBy: req.user.id,
            title,
            description,
            time,
            date: date ? new Date(date) : undefined,
            status: 'pending',
            repeatType: repeatType || 'once'
        });

        const routine = await newRoutine.save();
        res.json(routine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/routines/:elderId
// @desc    Get routines for a specific elder
// @access  Private (Elder can only get their own, Family Member needs permission)
router.get('/:elderId', auth, async (req, res) => {
    try {
        // Elders can only view their own routines
        if (req.user.role === 'Elder' && req.user.id !== req.params.elderId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Family members need approved permission link
        if (req.user.role === 'Family Member') {
            const familyLink = await ElderFamilyLink.findOne({
                elderId: req.params.elderId,
                familyId: req.user.id,
                consentStatus: 'Approved',
                'permissions.viewRoutines': true
            });

            if (!familyLink) {
                return res.status(403).json({ message: 'You do not have permission to view this elder\'s routines' });
            }
        }

        const routines = await Routine.find({ elder: req.params.elderId }).sort({ time: 1 });
        res.json(routines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/routines/:id
// @desc    Update a routine
// @access  Private (Family Member or Admin)
router.put('/:id', auth, authorize('Family Member', 'Admin'), async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        if (!routine) return res.status(404).json({ message: 'Routine not found' });

        // Family members need permission to update routine for the elder
        if (req.user.role === 'Family Member') {
            const familyLink = await ElderFamilyLink.findOne({
                elderId: routine.elder,
                familyId: req.user.id,
                consentStatus: 'Approved',
                'permissions.viewRoutines': true
            });

            if (!familyLink) {
                return res.status(403).json({ message: 'You do not have permission to update routines for this elder' });
            }
        }

        const { title, description, time, date, status, repeatType } = req.body;
        if (title !== undefined) routine.title = title;
        if (description !== undefined) routine.description = description;
        if (time !== undefined) routine.time = time;
        if (date !== undefined) routine.date = date ? new Date(date) : undefined;
        if (repeatType !== undefined) routine.repeatType = repeatType;
        if (status !== undefined) {
            routine.status = status;
            routine.completed = status === 'completed';
            if (status === 'completed') routine.lastCompletedDate = Date.now();
        }

        await routine.save();
        res.json(routine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/routines/:id
// @desc    Delete a routine
// @access  Private (Family Member or Admin)
router.delete('/:id', auth, authorize('Family Member', 'Admin'), async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);
        if (!routine) return res.status(404).json({ message: 'Routine not found' });

        // Family members need permission to delete routine for the elder
        if (req.user.role === 'Family Member') {
            const familyLink = await ElderFamilyLink.findOne({
                elderId: routine.elder,
                familyId: req.user.id,
                consentStatus: 'Approved',
                'permissions.viewRoutines': true
            });

            if (!familyLink) {
                return res.status(403).json({ message: 'You do not have permission to delete routines for this elder' });
            }
        }

        await Routine.findByIdAndRemove(req.params.id);
        res.json({ message: 'Routine removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/routines/:id/complete
// @desc    Mark routine as completed
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
    try {
        const routine = await Routine.findById(req.params.id);

        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        // Elders can only mark their own routines as complete
        if (req.user.role === 'Elder' && routine.elder.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        routine.completed = true;
        routine.lastCompletedDate = Date.now();

        await routine.save();
        res.json(routine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
