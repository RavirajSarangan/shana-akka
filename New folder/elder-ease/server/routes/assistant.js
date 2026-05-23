const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const https = require('https');
const Medication = require('../models/Medication');
const Routine = require('../models/Routine');
const MemoryWall = require('../models/MemoryWall');
const HealthNote = require('../models/HealthNote');

// Intent Detection Keywords - supports natural language matching
const INTENT_KEYWORDS = {
    medication: [
        'medication', 'medications', 'medicine', 'medicines', 'tablet', 'tablets',
        'pill', 'pills', 'dose', 'dosage', 'prescription', 'drug', 'drugs',
        'take', 'taking', 'should i take', 'what medicine', 'what tablet',
        'what pill', 'what drug', 'do i have', 'any tablets', 'any pills',
        'any medicines', 'any medication', 'scheduled'
    ],
    reminder: [
        'reminder', 'reminders', 'remind', 'reminding', 'alert', 'alerts',
        'notification', 'notifications', 'today', 'upcoming', 'schedule',
        'scheduled', 'pending', 'due', 'coming', 'what\'s coming'
    ],
    routine: [
        'routine', 'routines', 'task', 'tasks', 'activity', 'activities',
        'schedule', 'day', 'today', 'should i do', 'what should i do',
        'what\'s my', 'daily plan', 'plan', 'what do i need', 'what\'s today'
    ],
    memory: [
        'memory', 'memories', 'memory wall', 'wall', 'photo', 'photos',
        'picture', 'pictures', 'image', 'images', 'remember', 'remembering',
        'past', 'old', 'moment', 'moments', 'recall'
    ],
    notes: [
        'care notes', 'notes', 'note', 'health notes', 'observations',
        'observation', 'care log', 'log', 'what\'s been', 'history'
    ],
    help: [
        'help', 'help me', 'what can you do', 'what can you help', 'how do i use',
        'what are you', 'who are you', 'what\'s your purpose', 'capabilities',
        'commands', 'command', 'hello', 'hi', 'hey', 'greetings'
    ]
};

// Function to detect user intent from input
const detectIntent = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    let bestMatch = null;
    let maxMatches = 0;

    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
        let matches = 0;
        for (const keyword of keywords) {
            if (lowerQuery.includes(keyword)) {
                matches++;
            }
        }
        
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = intent;
        }
    }

    // If no keyword matches found, return 'help' as fallback
    return bestMatch || 'help';
};

// @route   POST api/assistant/query
// @desc    Process voice/text assistant query with intelligent intent detection
// @access  Private
router.post('/query', auth, async (req, res) => {
    const { command } = req.body;
    const elderId = req.user.id;

    if (!command) {
        return res.status(400).json({ message: 'Command is required' });
    }

    try {
        const intent = detectIntent(command);

        // 1. MEDICATION INTENT
        if (intent === 'medication') {
            const meds = await Medication.find({ elder: elderId, active: true }).lean();
            
            if (meds.length === 0) {
                return res.json({
                    type: 'medications',
                    intent: 'medication',
                    text: 'You do not have any medications scheduled right now.',
                    data: []
                });
            }

            const medDetails = meds.map(m => 
                `${m.name} - ${m.dosage} ${m.frequency}${m.timings && m.timings.length > 0 ? ' at ' + m.timings.join(', ') : ''}`
            );

            return res.json({
                type: 'medications',
                intent: 'medication',
                text: `I found ${meds.length} medication${meds.length !== 1 ? 's' : ''} in your list. ${medDetails.join('. ')}. Please follow your prescription as directed.`,
                data: medDetails
            });
        }

        // 2. REMINDER INTENT (combines medications and routines)
        if (intent === 'reminder') {
            const meds = await Medication.find({ elder: elderId, active: true }).lean();
            const routines = await Routine.find({ elder: elderId, completed: false }).lean();
            
            const reminders = [];
            
            // Add medication reminders
            meds.forEach(m => {
                if (m.timings && m.timings.length > 0) {
                    reminders.push(`💊 Medication: ${m.name} (${m.dosage}) - ${m.timings.join(', ')}`);
                }
            });

            // Add routine reminders
            routines.forEach(r => {
                if (r.time) {
                    reminders.push(`📋 Task: ${r.title} at ${r.time}`);
                }
            });

            if (reminders.length === 0) {
                return res.json({
                    type: 'reminders',
                    intent: 'reminder',
                    text: 'You do not have any reminders for today.',
                    data: []
                });
            }

            return res.json({
                type: 'reminders',
                intent: 'reminder',
                text: `You have ${reminders.length} reminder${reminders.length !== 1 ? 's' : ''} today. ${reminders.slice(0, 3).join('. ')}${reminders.length > 3 ? ' and more.' : ''}`,
                data: reminders
            });
        }

        // 3. ROUTINE INTENT
        if (intent === 'routine') {
            const routines = await Routine.find({ elder: elderId }).lean();
            
            if (routines.length === 0) {
                return res.json({
                    type: 'routine',
                    intent: 'routine',
                    text: 'You do not have any routines scheduled for today.',
                    data: []
                });
            }

            const routineDetails = routines.map(r => 
                `${r.time ? r.time + ': ' : ''}${r.title}${r.description ? ' - ' + r.description : ''}`
            );

            return res.json({
                type: 'routine',
                intent: 'routine',
                text: `Here is your routine for today: ${routineDetails.join('. ')}. Try to complete all tasks to stay healthy.`,
                data: routineDetails
            });
        }

        // 4. MEMORY WALL INTENT
        if (intent === 'memory') {
            const memories = await MemoryWall.find({ elder: elderId }).sort({ createdAt: -1 }).limit(5).lean();
            
            if (memories.length === 0) {
                return res.json({
                    type: 'memories',
                    intent: 'memory',
                    text: 'Your memory wall is currently empty. Try uploading some photos to remember special moments.',
                    data: []
                });
            }

            const memoryDetails = memories.map(m => m.caption || m.title || 'A cherished memory');

            return res.json({
                type: 'memories',
                intent: 'memory',
                text: `I've opened your memory wall. You have ${memories.length} recent memories. ${memoryDetails.slice(0, 2).join('. ')}.`,
                data: memoryDetails
            });
        }

        // 5. HEALTH NOTES / CARE NOTES INTENT
        if (intent === 'notes') {
            const notes = await HealthNote.find({ elder: elderId }).sort({ createdAt: -1 }).limit(5).lean();
            
            if (notes.length === 0) {
                return res.json({
                    type: 'notes',
                    intent: 'notes',
                    text: 'There are no care notes recorded yet.',
                    data: []
                });
            }

            const noteDetails = notes.map(n => `${n.title || 'Note'}: ${n.content?.substring(0, 50)}...`);

            return res.json({
                type: 'notes',
                intent: 'notes',
                text: `Here are your recent care notes: ${noteDetails.slice(0, 2).join('. ')}`,
                data: noteDetails
            });
        }

        // 6. HELP / FALLBACK INTENT
        if (intent === 'help') {
            return res.json({
                type: 'help',
                intent: 'help',
                text: 'Hello! I am your AI Virtual Nurse. I can help you with: your medications and their schedules, reminders and upcoming tasks, your daily routine, your memory wall with special moments, and your care notes. What would you like to know?',
                data: [
                    'Show my medications',
                    'Show my reminders',
                    'Read my routine',
                    'Show my memories',
                    'Show my care notes'
                ]
            });
        }

        // Default Fallback - should rarely happen due to help intent
        return res.json({
            type: 'help',
            intent: 'help',
            text: 'I can help with your medications, reminders, routine, memories, and care notes. Please ask something like: "Show my medications", "What is my routine?", or "Show my reminders today".',
            data: []
        });

    } catch (err) {
        console.error('Assistant error:', err);
        res.status(500).json({ 
            message: 'Server error processing assistant query',
            type: 'error',
            text: 'Sorry, I had trouble processing that. Please try again.'
        });
    }
});

// @route   POST api/assistant/speak
// @desc    Convert text to speech via ElevenLabs and return audio
// @access  Public (called from browser)
router.post('/speak', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

    if (!apiKey) {
        return res.status(500).json({ message: 'ElevenLabs API key not configured' });
    }

    const body = JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    });

    const options = {
        hostname: 'api.elevenlabs.io',
        path: `/v1/text-to-speech/${voiceId}`,
        method: 'POST',
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    try {
        const elevenReq = https.request(options, (elevenRes) => {
            if (elevenRes.statusCode !== 200) {
                return res.status(elevenRes.statusCode).json({ message: 'ElevenLabs API error' });
            }
            res.setHeader('Content-Type', 'audio/mpeg');
            elevenRes.pipe(res);
        });

        elevenReq.on('error', (err) => {
            console.error('ElevenLabs request error:', err);
            res.status(500).json({ message: 'Failed to generate speech' });
        });

        elevenReq.write(body);
        elevenReq.end();
    } catch (err) {
        console.error('ElevenLabs error:', err);
        res.status(500).json({ message: 'Failed to generate speech' });
    }
});

module.exports = router;
