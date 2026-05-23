const express = require('express');
const Medication = require('../models/Medication');
const Alert = require('../models/Alert');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET api/medications
// @desc    Get all medications for the logged in elder or family member's elder
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Elder') {
            query.elder = req.user.id;
        } else if (req.user.role === 'Family Member') {
            if (req.query.elderId) {
                query.elder = req.query.elderId;
            }
        }

        const medications = await Medication.find(query).populate('elder', 'name').sort({ active: -1 });
        res.json(medications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/medications
// @desc    Add new medication
// @access  Private (Family or Admin)
router.post('/', auth, authorize('Family Member', 'Admin'), async (req, res) => {
    const { name, dosage, frequency, timings, instructions, elderId, stock, refillThreshold } = req.body;

    try {
        const newMedication = new Medication({
            elder: elderId || req.user.id,
            name,
            dosage,
            frequency,
            timings,
            instructions,
            stock: stock || 0,
            refillThreshold: refillThreshold || 5
        });

        const medication = await newMedication.save();
        res.json(medication);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/medications/:id/log
// @desc    Log medication status
// @access  Private
router.put('/:id/log', auth, async (req, res) => {
    const { status } = req.body; // 'Taken' or 'Missed'

    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        medication.logs.push({
            status,
            takenAt: status === 'Taken' ? Date.now() : null,
        });

        if (status === 'Taken') {
            medication.stock = Math.max(0, (medication.stock || 0) - 1);

            if (medication.stock <= (medication.refillThreshold || 5)) {
                const stockAlert = new Alert({
                    user: medication.elder,
                    title: 'Low Medication Stock',
                    message: `Only ${medication.stock} doses remaining of ${medication.name}. Please refill soon.`,
                    type: 'Medication',
                    severity: 'Medium'
                });
                await stockAlert.save();
            }
        }

        await medication.save();

        if (status === 'Missed') {
            const newAlert = new Alert({
                user: medication.elder,
                title: 'Missed Medication',
                message: `Elder missed their dose of ${medication.name}`,
                type: 'Medication',
                severity: 'High'
            });
            await newAlert.save();
        }

        res.json(medication);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/medications/:id/refill
// @desc    Update medication stock
// @access  Private (Family or Admin)
router.put('/:id/refill', auth, authorize('Family Member', 'Admin'), async (req, res) => {
    const { stock } = req.body;

    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        medication.stock = stock;
        await medication.save();

        res.json(medication);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/medications/:id
// @desc    Delete medication
// @access  Private (Family or Admin)
router.delete('/:id', auth, authorize('Family Member', 'Admin'), async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        await Medication.deleteOne({ _id: req.params.id });

        res.json({ message: 'Medication entry was deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
