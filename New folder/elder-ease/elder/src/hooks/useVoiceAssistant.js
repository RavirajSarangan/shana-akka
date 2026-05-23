const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

export const speak = async (text) => {
    try {
        const res = await fetch('/api/assistant/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error('TTS failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
    } catch {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }
};

export const startListening = (onResult, onError) => {
    if (!recognition) {
        onError("Speech recognition not supported in this browser.");
        return;
    }

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        onResult(command);
    };

    recognition.onerror = (event) => {
        onError(event.error);
    };

    recognition.start();
};

export const stopListening = () => {
    if (recognition) recognition.stop();
};

// Hook for using voice in components
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoiceAssistant = (data = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const navigate = useNavigate();

    const processCommand = useCallback((command) => {
        setIsListening(false);
        setLastCommand(command);

        // Navigation Commands
        if (command.includes('routine')) {
            speak("Opening your daily routine.");
            navigate('/routine');
        } else if (command.includes('medication') || command.includes('medicine')) {
            speak("Showing your medications.");
            navigate('/medications');
        } else if (command.includes('wellness') || command.includes('relax')) {
            speak("Opening wellness and relaxation exercises.");
            navigate('/wellness');
        } else if (command.includes('home') || command.includes('dashboard')) {
            speak("Going to your dashboard.");
            navigate('/dashboard');
        }
        // Query Commands (using provided data)
        else if (command.includes('should i do now') || command.includes('next task') || command.includes('what to do')) {
            if (data.routines && data.routines.length > 0) {
                const nextTask = data.routines.find(r => !r.completed);
                if (nextTask) {
                    speak(`Your next task is ${nextTask.title} at ${nextTask.time}.`);
                } else {
                    speak("You have completed all your tasks for now. Well done!");
                }
            } else {
                speak("I don't see any tasks on your schedule right now.");
            }
        } else if (command.includes('next medicine') || command.includes('what time') && command.includes('medicine')) {
            if (data.medications && data.medications.length > 0) {
                // Simplified logic: finds first medication that hasn't been taken today
                const today = new Date().toDateString();
                const nextMed = data.medications.find(m => {
                    const takenToday = m.logs && m.logs.some(l =>
                        l.status === 'Taken' && new Date(l.date).toDateString() === today
                    );
                    return !takenToday;
                });

                if (nextMed) {
                    const time = nextMed.timings && nextMed.timings.length > 0 ? nextMed.timings[0] : "as needed";
                    speak(`Your next medicine is ${nextMed.name} scheduled for ${time}.`);
                } else {
                    speak("You have taken all your medicines for today. Great job!");
                }
            } else {
                speak("You don't have any medications scheduled.");
            }
        } else if (command.includes('read') && (command.includes('routine') || command.includes('schedule'))) {
            if (data.routines && data.routines.length > 0) {
                const pending = data.routines.filter(r => !r.completed);
                if (pending.length > 0) {
                    const titles = pending.map(p => p.title).join(", ");
                    speak(`Today you have: ${titles}.`);
                } else {
                    speak("Your routine is all clear for today.");
                }
            }
        }
        // Emergency Commands
        else if (command.includes('help') || command.includes('emergency') || command.includes('sos')) {
            speak("I am alerting your family immediately. Please stay calm, help is on the way.");
            // In a real app, logic to trigger SOS backend call would go here
            if (data.onEmergency) data.onEmergency();
        }
        // Conversational / Feedback
        else {
            speak("I heard you say " + command + ". I'm not sure how to help with that, but I can show your medications or routine if you'd like.");
        }
    }, [navigate, data]);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            startListening(processCommand, (err) => {
                console.error(err);
                setIsListening(false);
            });
        }
    };

    return { isListening, lastCommand, toggleListening, speak };
};
