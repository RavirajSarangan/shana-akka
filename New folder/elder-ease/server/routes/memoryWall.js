const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MemoryWall = require('../models/MemoryWall');
const ElderFamilyLink = require('../models/ElderFamilyLink');

// @route   GET api/memory-wall/all
// @desc    Get all memory wall items (for Admin)
// @access  Private (Admin)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const items = await MemoryWall.find().populate('elder', 'name').sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/memory-wall/:elderId
// @desc    Get all memory wall items for an elder
// @access  Private
router.get('/:elderId', auth, async (req, res) => {
    try {
        const { elderId } = req.params;
        const items = await MemoryWall.find({ elder: elderId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/memory-wall
// @desc    Upload a memory (photo/video metadata)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { elder, title, contentUrl, contentType, caption } = req.body;
        const newItem = new MemoryWall({
            elder,
            uploadedBy: req.user.id,
            title,
            contentUrl,
            contentType,
            caption
        });
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/memory-wall/:id
// @desc    Delete a memory
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await MemoryWall.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Memory not found' });
        
        // Admins or the uploader can delete
        if (req.user.role !== 'Admin') {
            if (!item.uploadedBy || item.uploadedBy.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to delete' });
            }
        }
        
        await MemoryWall.findByIdAndDelete(req.params.id);
        res.json({ message: 'Memory deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/memory-wall/:id
// @desc    Update a memory (Admin moderation/edit)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const updatedItem = await MemoryWall.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
