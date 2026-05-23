const mongoose = require('mongoose');
const WellnessContent = require('./models/WellnessContent');
const dotenv = require('dotenv');

dotenv.config();

const music = [
    {
        type: 'Music',
        title: 'Morning Forest Birds',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        description: 'Peaceful forest sounds with birds chirping.',
        active: true
    },
    {
        type: 'Music',
        title: 'Deep Ocean Waves',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        description: 'Relaxing sounds of waves crashing on the shore.',
        active: true
    },
    {
        type: 'Music',
        title: 'Soft Rain on Roof',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        description: 'Calming rain sounds for better sleep.',
        active: true
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await WellnessContent.insertMany(music);
        console.log('Seed music added successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
