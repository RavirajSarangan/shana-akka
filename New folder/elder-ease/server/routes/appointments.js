const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const ElderFamilyLink = require('../models/ElderFamilyLink');

// @route   GET api/appointments/:elderId
// @desc    Get all appointments for an elder
// @access  Private
router.get('/:elderId', auth, async (req, res) => {
    try {
        const { elderId } = req.params;

        // Permission check: if user is not the elder, must be a linked family member
        if (req.user.id !== elderId) {
            const link = await ElderFamilyLink.findOne({
                familyId: req.user.id,
                elderId: elderId,
                consentStatus: 'Approved'
            });
            if (!link && req.user.role !== 'Admin') {
                return res.status(403).json({ msg: 'Access denied' });
            }
        }

        const appointments = await Appointment.find({ elder: elderId }).sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/appointments
// @desc    Create an appointment
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { elder, title, date, description, location, type } = req.body;
        const newAppointment = new Appointment({
            elder,
            title,
            date,
            description,
            location,
            type,
            createdBy: req.user.id
        });
        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
