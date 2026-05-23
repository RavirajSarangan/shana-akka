const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Story = require('./models/Story');

dotenv.config();

const seedStories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const count = await Story.countDocuments();
        if (count > 0) {
            console.log('Stories already seeded. Clearing them first...');
            await Story.deleteMany({});
        }

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
                title: "Sample Story Book (PDF)",
                description: "A classic journey down the rabbit hole in PDF format.",
                pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Real accessible PDF sample for testing
                category: "Spiritual / Moral Stories", // Using required category
                duration: "15 min read",
                isFeatured: true
            }
        ];

        await Story.insertMany(storiesData);
        console.log('Sample stories seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

seedStories();
