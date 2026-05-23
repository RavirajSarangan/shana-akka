const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Story = require('../models/Story');
const StoryProgress = require('../models/StoryProgress');

// @route   GET api/stories
// @desc    Get all stories
// @access  Public or Private
router.get('/', auth, async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/stories/featured
// @desc    Get featured stories
// @access  Private
router.get('/featured', auth, async (req, res) => {
    try {
        const stories = await Story.find({ isFeatured: true }).limit(5);
        res.json(stories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/stories/:id
// @desc    Get story by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });
        res.json(story);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Story not found' });
        res.status(500).send('Server error');
    }
});

// @route   POST api/stories
// @desc    Add new story
// @access  Private (Admin)
router.post('/', [auth, authorize('Admin')], async (req, res) => {
    try {
        const newStory = new Story(req.body);
        const story = await newStory.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/stories/:id
// @desc    Update story
// @access  Private (Admin)
router.put('/:id', [auth, authorize('Admin')], async (req, res) => {
    try {
        let story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        story = await Story.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/stories/:id
// @desc    Delete story
// @access  Private (Admin)
router.delete('/:id', [auth, authorize('Admin')], async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ msg: 'Story not found' });

        await story.deleteOne();
        res.json({ msg: 'Story removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- PROGRESS & FAVORITES ---

// @route   GET api/stories/progress/mine
// @desc    Get user's favorites and reading progress
// @access  Private
router.get('/progress/mine', auth, async (req, res) => {
    try {
        const progress = await StoryProgress.find({ user: req.user.id }).populate('story');
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/stories/progress/:storyId
// @desc    Update progress or favorite status
// @access  Private
router.post('/progress/:storyId', auth, async (req, res) => {
    try {
        const { isFavorite, lastPage } = req.body;
        let progress = await StoryProgress.findOne({ user: req.user.id, story: req.params.storyId });

        if (progress) {
            if (isFavorite !== undefined) progress.isFavorite = isFavorite;
            if (lastPage !== undefined) progress.lastPage = lastPage;
            progress.lastReadAt = Date.now();
        } else {
            progress = new StoryProgress({
                user: req.user.id,
                story: req.params.storyId,
                isFavorite: isFavorite || false,
                lastPage: lastPage || 1
            });
        }

        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/stories/seed
// @desc    Seed stories data
// @access  Private (Admin)
router.post('/seed/data', [auth, authorize('Admin')], async (req, res) => {
    try {
        const count = await Story.countDocuments();
        if (count > 0) return res.status(400).json({ msg: 'Stories already seeded' });

        const storiesData = [
            {
                title: "The Little Bird and the Morning Sun",
                description: "A calming story about a little bird greeting the day.",
                content: "Once upon a time, a little bird named Pippin woke up before the sun. He fluffed his feathers, taking a deep breath of the cool morning air. The world was quiet and peaceful. \n\nSlowly, a golden light began to peek over the horizon. The trees whispered a gentle greeting. Pippin sang a soft song, a melody of hope and comfort. Every new day brings a fresh start, a clean slate, and the warmth of the sun to guide you.",
                category: "Bedtime Stories",
                duration: "2 min read",
                narrationEnabled: true,
                isFeatured: true
            },
            {
                title: "Climbing Your Own Mountain",
                description: "A powerful tale about overcoming obstacles step by step.",
                content: "An old wanderer once stood at the base of a towering mountain. 'It is too high,' said the villagers. But the wanderer simply smiled. 'I don't look at the peak,' he said. 'I only look at the step beneath my foot.' \n\nDay by day, step by step, he climbed. When he finally reached the top, he looked down at the beautiful world below. It wasn't about speed; it was about moving forward, finding joy in the journey itself.",
                category: "Motivational Stories",
                duration: "3 min read",
                narrationEnabled: true
            },
            {
                title: "The Garden of Kindness",
                description: "A story about seeds that bloom into unexpected friendships.",
                content: "Mrs. Higgins had the finest garden in town. But she never kept the flowers to herself. Everyday, she gave bouquets to neighbors, strangers, and children passing by. \n\nWhen a harsh winter ruined her garden, she felt lost. But as spring arrived, people from all over town brought her seeds, sprouts, and bulbs. Her garden bloomed more beautifully than ever. For kindness, once planted, always continues to grow.",
                category: "Positive Life Stories",
                duration: "4 min read",
                isFeatured: true
            },
            {
                title: "The Wise Old Owl",
                description: "A classic short fable about wisdom and listening.",
                content: "A wise old owl lived in an oak tree. The more he saw, the less he spoke. The less he spoke, the more he heard. \n\nHe heard people talking about their worries and dreams. He learned that giving attention to others' words often solves much more than giving your own. We could all be a little wiser if we were like that old owl.",
                category: "Short Classic Stories",
                duration: "1 min read"
            },
            {
                title: "Nostalgic Summer Recess",
                description: "A memory-triggering story about old school days and recess.",
                content: "Do you remember the sound of the school bell? The anticipation that built up right before recess? The scramble to grab your jumper and rush out the doors. \n\nThe smell of fresh cut grass, the feeling of the sun on your face, the laughter echoing across the asphalt and dirt. Jumping rope, trading marbles, running until you were breathless. Simple joys that stay tucked away in the corners of our minds forever.",
                category: "Memory-Based Stories",
                duration: "3 min read"
            },
            {
                title: "Alice's Adventures in Wonderland (Excerpt)",
                description: "A classic journey down the rabbit hole in PDF format.",
                pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf", // Sample PDF placeholder
                category: "Classic Stories",
                duration: "15 min read",
                isFeatured: true
            }
        ];

        await Story.insertMany(storiesData);
        res.json({ msg: 'Sample stories seeded successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
