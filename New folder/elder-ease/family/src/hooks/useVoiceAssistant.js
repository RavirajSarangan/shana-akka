const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

export const speak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for elderly
        window.speechSynthesis.speak(utterance);
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

export const useVoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState('');

    const processCommand = useCallback((command) => {
        setIsListening(false);
        setLastCommand(command);

        if (command.includes('routine')) {
            speak("Your next activity is a morning walk at 10 AM.");
        } else if (command.includes('medication') || command.includes('medicine')) {
            speak("You have two medicines to take today. One now, and one in the evening.");
        } else if (command.includes('help') || command.includes('emergency')) {
            speak("Alerting your family now. Please stay calm.");
        } else {
            speak("I heard you say " + command + ". How else can I help?");
        }
    }, []);

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
