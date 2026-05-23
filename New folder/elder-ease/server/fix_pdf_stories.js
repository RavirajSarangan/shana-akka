const mongoose = require('mongoose');
const Story = require('./models/Story');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    // Remove old broken PDF stories
    await Story.deleteMany({ pdfUrl: { $exists: true, $ne: null, $ne: '' } });

    // Insert fixed stories with known-working PDF URLs from planetebook.com
    await Story.insertMany([
        {
            title: 'Alice in Wonderland',
            description: "Follow Alice's adventures in a magical fantasy world filled with wonder.",
            category: 'Classic',
            duration: '20 min read',
            content: '',
            pdfUrl: 'https://www.planetebook.com/free-ebooks/alices-adventures-in-wonderland.pdf',
            published: true,
            narrationEnabled: false
        },
        {
            title: 'The Wonderful Wizard of Oz',
            description: 'Dorothy and her friends journey through the magical land of Oz.',
            category: 'Adventure',
            duration: '18 min read',
            content: '',
            pdfUrl: 'https://www.planetebook.com/free-ebooks/the-wonderful-wizard-of-oz.pdf',
            published: true,
            narrationEnabled: false
        },
        {
            title: 'Around the World in 80 Days',
            description: 'Phileas Fogg bets he can circle the globe in just 80 days.',
            category: 'Adventure',
            duration: '25 min read',
            content: '',
            pdfUrl: 'https://www.planetebook.com/free-ebooks/around-the-world-in-eighty-days.pdf',
            published: true,
            narrationEnabled: false
        },
        {
            title: 'The Jungle Book',
            description: 'The classic story of Mowgli raised by wolves in the Indian jungle.',
            category: 'Classic',
            duration: '22 min read',
            content: '',
            pdfUrl: 'https://www.planetebook.com/free-ebooks/the-jungle-book.pdf',
            published: true,
            narrationEnabled: false
        }
    ]);

    console.log('PDF stories fixed and seeded successfully!');
    process.exit();
}).catch(e => { console.error(e); process.exit(1); });
