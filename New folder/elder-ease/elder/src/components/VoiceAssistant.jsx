import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Mic, MicOff, Send, Volume2, VolumeX, RefreshCcw, HeartPulse } from 'lucide-react';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
    }

    const speak = useCallback(async (text) => {
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
            // Fallback to browser TTS if ElevenLabs fails
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }
    }, []);

    const processCommand = useCallback(async (text) => {
        if (!text.trim()) return;
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/assistant/query', { command: text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResponse(res.data);
            speak(res.data.text);
        } catch (err) {
            console.error(err);
            setError('Sorry, I had trouble processing that. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [speak]);

    const handleMicClick = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            if (!recognition) {
                setError('Microphone not available in this browser.');
                return;
            }
            setIsListening(true);
            recognition.start();
        }
    };

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setCommand(transcript);
            setIsListening(false);
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
            if (event.error === 'no-speech') {
                setError('Please try again');
            } else {
                setError(`Mic Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }, [recognition, processCommand]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (command.trim()) {
            processCommand(command);
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: '#E0E7FF', padding: '12px', borderRadius: '50%' }}>
                    <HeartPulse size={32} color="#1E3A8A" />
                </div>
                <div>
                    <h2 style={{ fontSize: '28px', color: '#1E293B', margin: 0 }}>AI Virtual Nurse</h2>
                    <p style={{ fontSize: '18px', color: '#64748B', margin: 0 }}>Ask me about reminders, medications, or routines.</p>
                </div>
            </div>

            {/* Mic and Input Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                        onClick={handleMicClick}
                        style={{
                            background: isListening ? '#EF4444' : '#1E3A8A',
                            color: 'white',
                            border: 'none',
                            padding: '25px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(30, 58, 138, 0.2)'
                        }}
                    >
                        {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                    </button>

                    <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="Type or speak a command..."
                            style={{
                                flex: 1,
                                padding: '20px 30px',
                                borderRadius: '40px',
                                border: '2px solid #E2E8F0',
                                fontSize: '24px',
                                outline: 'none',
                                background: '#F8FAFC'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !command.trim()}
                            style={{
                                background: '#1E3A8A',
                                color: 'white',
                                border: 'none',
                                padding: '0 30px',
                                borderRadius: '40px',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                opacity: (loading || !command.trim()) ? 0.6 : 1
                            }}
                        >
                            <Send size={24} />
                        </button>
                    </form>
                </div>

                {isListening && (
                    <div style={{ textAlign: 'center', color: '#1E3A8A', fontWeight: 'bold', fontSize: '20px', animation: 'pulse 1.5s infinite' }}>
                        Listening... Please speak now.
                    </div>
                )}

                {error && (
                    <div style={{ color: '#EF4444', background: '#FEF2F2', padding: '15px', borderRadius: '12px', textAlign: 'center', fontSize: '18px', border: '1px solid #FECACA' }}>
                        {error}
                    </div>
                )}
            </div>

            {/* Response Section */}
            {response && (
                <div style={{ marginTop: '30px', padding: '25px', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B', lineHeight: '1.4' }}>
                            {response.text}
                        </div>
                        <button
                            onClick={() => speak(response.text)}
                            style={{
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                padding: '10px 15px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '16px',
                                color: '#1E3A8A',
                                fontWeight: 'bold'
                            }}
                        >
                            <Volume2 size={20} /> Speak Response
                        </button>
                    </div>

                    {response.data && response.data.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            {response.data.map((item, idx) => (
                                <div key={idx} style={{
                                    background: 'white',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    fontSize: '20px',
                                    color: '#334155',
                                    borderLeft: '5px solid #1E3A8A',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                                }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <RefreshCcw size={40} className="spinner" color="#1E3A8A" />
                    <p style={{ fontSize: '20px', color: '#64748B' }}>Identifying intent...</p>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default VoiceAssistant;
