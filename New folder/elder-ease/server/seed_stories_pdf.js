const mongoose = require('mongoose');
const Story = require('./models/Story');
const dotenv = require('dotenv');

dotenv.config();

const stories = [
    {
        title: 'The Little Prince (Classic PDF)',
        description: 'A beautiful classic story by Antoine de Saint-Exupéry.',
        category: 'Classic',
        duration: '15 min read',
        content: 'Excerpt from The Little Prince...',
        pdfUrl: 'https://www.unicef.org/romania/sites/unicef.org.romania/files/2020-05/The%20Little%20Prince.pdf',
        published: true
    },
    {
        title: 'Short Mystery Story',
        description: 'A collection of short mystery stories for quick reading.',
        category: 'Mystery',
        duration: '10 min read',
        content: 'The mystery of the golden key...',
        pdfUrl: 'https://pdfroom.com/download/mystery-short-stories/5e9c0b', // This might be a landing page but let's try a direct one if possible
        published: true
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Story.insertMany(stories);
        console.log('Seed stories added successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
