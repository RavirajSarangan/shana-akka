const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Medication = require('../models/Medication');
const Routine = require('../models/Routine');
const ElderFamilyLink = require('../models/ElderFamilyLink');

const EMERGENCY_KEYWORDS = ['chest pain', 'cannot breathe', 'severe bleeding', 'fainting', 'emergency', 'fall accident', 'serious pain', 'heart attack', 'stroke', 'bleeding'];
const MEDICATION_KEYWORDS = ['medicine', 'medication', 'pill', 'prescriptions'];
const ROUTINE_KEYWORDS = ['routine', 'schedule', 'today', 'what should i do'];
const WATER_KEYWORDS = ['water', 'drink', 'thirsty', 'hydration'];
const RELAXATION_KEYWORDS = ['relax', 'anxious', 'stress', 'stories', 'breathe', 'music', 'tired', 'lonely'];
const NAV_KEYWORDS = ['help', 'navigate', 'find', 'open'];

// Intent Classification & Data Handling
const getAIResponse = async (message, userId) => {
    const msg = message.toLowerCase();

    // 1. Emergency Check (Highest Priority)
    if (EMERGENCY_KEYWORDS.some(kw => msg.includes(kw))) {
        return "🚨 This may need urgent medical attention. Please contact emergency services or a caregiver immediately. Press the SOS button if you need immediate help.";
    }

    // 2. Medication Intent
    if (MEDICATION_KEYWORDS.some(kw => msg.includes(kw))) {
        const meds = await Medication.find({ elder: userId });
        if (meds.length > 0) {
            const nextMeds = meds.map(m => `${m.name} at ${m.timings}`).join(', ');
            return `I found your medication schedule. You have: ${nextMeds}. Remember to take them with a glass of water, and check the Medication page for more details.`;
        }
        return "You have no medications scheduled at the moment. Please check with your caregiver if you feel unwell.";
    }

    // 3. Routine Intent
    if (ROUTINE_KEYWORDS.some(kw => msg.includes(kw))) {
        const routines = await Routine.find({ elder: userId });
        if (routines.length > 0) {
            const active = routines.slice(0, 2).map(r => r.title).join(' and ');
            return `Your schedule today includes: ${active}. You can find the full list in your Routine section. Enjoy your day!`;
        }
        return "Your routine is clear right now. It's a great time to relax or read a story in the Relaxation section.";
    }

    // 4. Hydration Intent
    if (WATER_KEYWORDS.some(kw => msg.includes(kw))) {
        return "Drinking water is very important for your health! I recommend drinking a full glass of water right now. Your daily goal is 8 glasses.";
    }

    // 5. Emotional Support & Relaxation
    if (RELAXATION_KEYWORDS.some(kw => msg.includes(kw))) {
        return "I understand. I am here to support your wellbeing. You can try some deep breathing exercises or listen to calming stories. These are available in your Relaxation section on the dashboard.";
    }

    // 6. Navigation / Feature Help
    if (NAV_KEYWORDS.some(kw => msg.includes(kw))) {
        return "I can help you navigate ElderEase! Use the big buttons on your Dashboard to access Medications, Routine, Memory Wall, or the Relaxation library.";
    }

    // 7. General Healthcare Context Safe Responses
    if (msg.includes('how are you') || msg.includes('who are you')) {
        return "I am your ElderEase AI Virtual Nurse. I only provide supportive responses related to elderly wellbeing, medication reminders, daily routine, hydration, safety, and app navigation.";
    }

    // 8. Strict Scoped Fallback (If no intent matches)
    return "I am here to support your health, routine, and wellbeing. Please ask me about medication, reminders, safety, or daily support. For serious medical issues, please contact a doctor or emergency service.";
};

const detectMood = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('lonely') || msg.includes('sad') || msg.includes('anxious') || msg.includes('stress')) return 'Low';
    if (msg.includes('happy') || msg.includes('good') || msg.includes('great') || msg.includes('thanks')) return 'Positive';
    if (EMERGENCY_KEYWORDS.some(kw => msg.includes(kw))) return 'Emergency';
    return 'Neutral';
};

// @route   POST api/chat
router.post('/', auth, async (req, res) => {
    try {
        const { message } = req.body;

        let conversation = await Conversation.findOne({ user: req.user.id });
        if (!conversation) {
            conversation = new Conversation({ user: req.user.id, messages: [] });
        }

        const mood = detectMood(message);
        const aiResponse = await getAIResponse(message, req.user.id);

        conversation.messages.push({ role: 'user', content: message });
        conversation.messages.push({ role: 'assistant', content: aiResponse });
        conversation.moodTag = mood;
        conversation.updatedAt = Date.now();

        await conversation.save();
        res.json({ response: aiResponse, mood });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/chat
router.get('/', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ user: req.user.id });
        res.json(conversation || { messages: [] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
