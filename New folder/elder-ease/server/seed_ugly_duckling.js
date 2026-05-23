const mongoose = require('mongoose');
const Story = require('./models/Story');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    await Story.create({
        title: 'The Ugly Duckling',
        description: 'A classic tale of a young duckling who is mocked for being different, only to grow into a beautiful swan.',
        category: 'Bedtime Stories',
        duration: '10 min read',
        content: '',
        pdfUrl: 'https://www.readthetale.com/popular-bedtime-stories/the-ugly-duckling',
        published: true,
        narrationEnabled: false
    });

    console.log('Story added!');
    process.exit();
}).catch(e => { console.error(e); process.exit(1); });
