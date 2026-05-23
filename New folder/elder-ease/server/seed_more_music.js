const mongoose = require('mongoose');
const WellnessContent = require('./models/WellnessContent');
const dotenv = require('dotenv');

dotenv.config();

const music = [
    {
        type: 'Music',
        title: 'Zen Garden Melody',
        category: 'Relaxation',
        duration: '10 min',
        content: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_f5eb80e1c2.mp3?filename=zen-garden-111166.mp3',
        description: 'A serene and tranquil instrumental piece taking you to a quiet zen garden.',
        active: true
    },
    {
        type: 'Music',
        title: 'Soft Piano Dreams',
        category: 'Sleep',
        duration: '15 min',
        content: 'https://cdn.pixabay.com/download/audio/2022/10/24/audio_3d1a3c74ea.mp3?filename=soft-piano-dreams-12345.mp3',
        description: 'Gentle piano notes to help ease the mind and prepare for a restful sleep.',
        active: true
    },
    {
        type: 'Music',
        title: 'Binaural Ocean Waves',
        category: 'Meditation',
        duration: '20 min',
        content: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_349d5a7d5c.mp3?filename=ocean-waves-112345.mp3',
        description: 'Immersive binaural beats mixed with soothing ocean waves to deepen meditation.',
        active: true
    },
    {
        type: 'Music',
        title: 'Morning Flute Awakening',
        category: 'Energy',
        duration: '5 min',
        content: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73f0e0dfb9.mp3?filename=morning-flute-113355.mp3',
        description: 'Bright and uplifting flute music to gently energize the start of your day.',
        active: true
    },
    {
        type: 'Music',
        title: 'Cozy Fireplace Crackle',
        category: 'Relaxation',
        duration: '30 min',
        content: 'https://cdn.pixabay.com/download/audio/2021/04/24/audio_b202bb9a9b.mp3?filename=fireplace-114455.mp3',
        description: 'Warm, continuous crackling sounds of a wood fire to create a cozy atmosphere.',
        active: true
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await WellnessContent.insertMany(music);
        console.log('Successfully added more music tracks to Music & Wellness Management');
        process.exit();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
