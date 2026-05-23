import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Music, BookOpen, Wind, ArrowLeft, Heart, Play, Pause, Phone, X, HelpCircle, Smile, ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StoryLibrary from '../components/StoryLibrary';

const Wellness = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('main'); // main, music, breathing, story, call, motivation, memory
    const [dbContent, setDbContent] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/wellness', {
                    headers: { 'x-auth-token': token, 'Authorization': `Bearer ${token}` }
                });
                setDbContent(res.data);
            } catch (err) { console.error(err); }
        };
        fetchContent();
    }, []);

    const renderView = () => {
        switch (activeView) {
            case 'music':
                return <MusicPlayer onBack={() => setActiveView('main')} remoteSongs={dbContent.filter(c => c.type === 'Music')} />;
            case 'breathing':
                return <BreathingExercise onBack={() => setActiveView('main')} />;
            case 'story':
                return <StoryLibrary onBack={() => setActiveView('main')} />;
            case 'motivation':
                return <Motivation onBack={() => setActiveView('main')} />;
            case 'memory':
                return <MemoryPrompts onBack={() => setActiveView('main')} />;
            case 'call':
                return <FamilyCall onBack={() => setActiveView('main')} />;
            default:
                return (
                    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    background: '#FFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '12px',
                                    padding: '10px 18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#1E3A8A',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                                onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
                            >
                                <ChevronLeft size={20} /> Dashboard
                            </button>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1E3A8A', margin: 0 }}>Relax & Enjoy</h1>
                                <p style={{ fontSize: '18px', color: '#64748B', margin: '4px 0 0' }}>Take a moment for yourself today.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                            <WellnessOption 
                                icon={<Music size={48} />} 
                                title="Calming Music" 
                                desc="Gentle melodies for deep relaxation."
                                onClick={() => setActiveView('music')} 
                                gradient="linear-gradient(135deg, #1E3A8A, #3B82F6)"
                            />
                            <WellnessOption 
                                icon={<Wind size={48} />} 
                                title="Breathing Exercises"
                                desc="Slow down and find your center." 
                                onClick={() => setActiveView('breathing')} 
                                gradient="linear-gradient(135deg, #1E40AF, #3B82F6)"
                            />
                            <WellnessOption 
                                icon={<BookOpen size={48} />} 
                                title="Read a Story"
                                desc="Enjoy classic tales and poems." 
                                onClick={() => setActiveView('story')} 
                                gradient="linear-gradient(135deg, #1E3A8A, #3B82F6)"
                            />
                            <WellnessOption 
                                icon={<Sparkles size={48} />} 
                                title="Daily Motivation"
                                desc="Personalized quotes to cheer you up." 
                                onClick={() => setActiveView('motivation')} 
                                gradient="linear-gradient(135deg, #D97706, #F59E0B)"
                            />
                            <WellnessOption 
                                icon={<HelpCircle size={48} />} 
                                title="Memory Prompts"
                                desc="Recall your favorite life moments." 
                                onClick={() => setActiveView('memory')} 
                                gradient="linear-gradient(135deg, #059669, #10B981)"
                            />
                            <WellnessOption 
                                icon={<Heart size={48} fill="white" />} 
                                title="Call Family" 
                                desc="Connect with your loved ones."
                                onClick={() => setActiveView('call')} 
                                gradient="linear-gradient(135deg, #DC2626, #EF4444)"
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 40%, #E2E8F0 100%)', 
            padding: '40px 24px',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {renderView()}
            </div>
            <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>
        </div>
    );
};

const WellnessOption = ({ icon, title, desc, onClick, gradient }) => (
    <button 
        onClick={onClick} 
        style={{ 
            padding: '32px',
            background: 'white',
            borderRadius: '24px',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.03)'; }}
    >
        <div style={{ 
            width: '80px', height: '80px', background: gradient, color: 'white', 
            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>{title}</h3>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>{desc}</p>
        
        <div style={{ 
            position: 'absolute', right: '32px', bottom: '32px', 
            color: '#E5E7EB', display: 'flex', alignItems: 'center' 
        }}>
            <ArrowRight size={24} />
        </div>
    </button>
);

// --- Sub-Components (Styled) ---

const MusicPlayer = ({ onBack, remoteSongs }) => {
    const [playing, setPlaying] = useState(null);
    const audioRef = useRef(null);

    const defaultSongs = [
        { id: 'd1', title: 'Nature Sounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 'd2', title: 'Calm Piano', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    ];

    const songs = [...defaultSongs, ...remoteSongs.map(s => ({ id: s._id, title: s.title, url: s.content }))];

    const togglePlay = (song) => {
        if (playing?.id === song.id) {
            audioRef.current.pause();
            setPlaying(null);
        } else {
            setPlaying(song);
            if (audioRef.current) {
                audioRef.current.src = song.url;
                audioRef.current.play();
            }
        }
    };

    return (
        <div style={{ background: 'white', padding: '48px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <button onClick={onBack} style={{ float: 'left', border: 'none', background: '#F3F4F6', color: '#4B5563', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#1E3A8A', marginBottom: '8px' }}>Calming Music</h2>
            <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '40px' }}>Select a track to start relaxing</p>
            
            <audio ref={audioRef} onEnded={() => setPlaying(null)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
                {songs.map(song => (
                    <button 
                        key={song.id} 
                        onClick={() => togglePlay(song)}
                        style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                            padding: '24px 32px', background: playing?.id === song.id ? '#E0E7FF' : '#F9FAFB',
                            border: `2px solid ${playing?.id === song.id ? '#1E3A8A' : '#F1F5F9'}`,
                            borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '20px', fontWeight: '700', color: playing?.id === song.id ? '#1E3A8A' : '#374151' }}>{song.title}</span>
                        <div style={{ background: playing?.id === song.id ? '#1E3A8A' : '#E5E7EB', color: 'white', padding: '8px', borderRadius: '50%' }}>
                            {playing?.id === song.id ? <Pause size={24} /> : <Play size={24} />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const BreathingExercise = ({ onBack }) => {
    const [phase, setPhase] = useState('Breathe In');
    const [counter, setCounter] = useState(4);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(prev => {
                if (prev === 1) {
                    if (phase === 'Breathe In') { setPhase('Hold'); return 4; }
                    else if (phase === 'Hold') { setPhase('Breathe Out'); return 4; }
                    else { setPhase('Breathe In'); return 4; }
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [phase]);

    const circleSize = phase === 'Breathe In' ? (240 + (4 - counter) * 30) : phase === 'Breathe Out' ? (360 - (4 - counter) * 30) : 360;

    return (
        <div style={{ background: 'white', padding: '48px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center', minHeight: '600px' }}>
            <button onClick={onBack} style={{ float: 'left', border: 'none', background: '#F3F4F6', color: '#4B5563', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#1E3A8A', marginBottom: '8px' }}>Deep Breathing</h2>
            <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '60px' }}>Follow the circle for a calmer mind</p>

            <div style={{ width: '400px', height: '400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ 
                    width: `${circleSize}px`, height: `${circleSize}px`, 
                    backgroundColor: '#1E3A8A', borderRadius: '50%', 
                    opacity: 0.15, transition: 'width 1s linear, height 1s linear',
                    filter: 'blur(2px)'
                }}></div>
                <div style={{ 
                    width: `${circleSize - 40}px`, height: `${circleSize - 40}px`, 
                    backgroundColor: '#1E3A8A', borderRadius: '50%', 
                    opacity: 0.1, transition: 'width 1s linear, height 1s linear',
                    position: 'absolute'
                }}></div>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#1E3A8A', margin: 0 }}>{phase.toUpperCase()}</h1>
                    <p style={{ fontSize: '42px', fontWeight: '800', color: '#64748B', margin: '10px 0 0' }}>{counter}</p>
                </div>
            </div>
        </div>
    );
};

const Motivation = ({ onBack }) => {
    const quotes = [
        "You are doing a great job today!",
        "Each day is a new beginning. Enjoy this one.",
        "Your smile is the most beautiful thing you can wear.",
        "Take a deep breath. You are safe and loved.",
        "You've accomplished so much already today!"
    ];
    const [qIdx, setQIdx] = useState(0);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new window.SpeechSynthesisUtterance(quotes[qIdx]);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, [qIdx]);

    return (
        <div style={{ background: 'white', padding: '80px 48px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <button onClick={onBack} style={{ float: 'left', border: 'none', background: '#F3F4F6', color: '#4B5563', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
            <div style={{ background: '#FEF3C7', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px' }}>
                <Smile size={72} color="#D97706" />
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#0F172A', marginBottom: '48px', lineHeight: 1.2 }}>"{quotes[qIdx]}"</h2>
            <button 
                onClick={() => setQIdx((qIdx + 1) % quotes.length)}
                style={{ background: '#D97706', color: 'white', border: 'none', padding: '20px 48px', borderRadius: '16px', fontSize: '20px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 20px rgba(217,119,6,0.2)' }}
            >
                Give Me Another Quote
            </button>
        </div>
    );
};

const MemoryPrompts = ({ onBack }) => {
    const prompts = [
        "What was your favorite food when you were a child?",
        "Do you remember the name of your first pet?",
        "What is one of your happiest memories from school?",
        "If you could travel back to any vacation, where would it be?",
        "What was your first job like?"
    ];
    const [pIdx, setPIdx] = useState(0);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new window.SpeechSynthesisUtterance(prompts[pIdx]);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, [pIdx]);

    return (
        <div style={{ background: 'white', padding: '80px 48px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <button onClick={onBack} style={{ float: 'left', border: 'none', background: '#F3F4F6', color: '#4B5563', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
            <div style={{ background: '#D1FAE5', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px' }}>
                <HelpCircle size={72} color="#1E3A8A" />
            </div>
            <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Memory Prompt</p>
            <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#0F172A', marginBottom: '48px', lineHeight: 1.3 }}>{prompts[pIdx]}</h2>
            <button 
                onClick={() => setPIdx((pIdx + 1) % prompts.length)}
                style={{ background: '#1E3A8A', color: 'white', border: 'none', padding: '20px 48px', borderRadius: '16px', fontSize: '20px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 20px rgba(30,58,138,0.2)' }}
            >
                Show Different Prompt
            </button>
        </div>
    );
};

const FamilyCall = ({ onBack }) => {
    const [contacts, setContacts] = useState([]);
    const [calling, setCalling] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/family/contacts', { headers: { 'x-auth-token': token } });
                setContacts(res.data);
            } catch (err) { console.error(err); }
        };
        fetchContacts();
    }, []);

    if (calling) return (
        <div style={{ background: '#0F172A', padding: '100px 48px', borderRadius: '32px', textAlign: 'center', color: 'white' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', animation: 'pulse 2s infinite' }}>
                <Phone size={60} fill="white" />
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>Calling {calling.name}...</h2>
            <p style={{ fontSize: '20px', opacity: 0.6, marginBottom: '64px' }}>Connecting to secure video call</p>
            <button 
                onClick={() => setCalling(null)}
                style={{ background: '#EF4444', color: 'white', border: 'none', padding: '24px 64px', borderRadius: '20px', fontSize: '24px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto' }}
            >
                <X size={32} /> End Call
            </button>
            <style>{`
                @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(30, 41, 59, 0.7); } 70% { box-shadow: 0 0 0 40px rgba(30, 41, 59, 0); } 100% { box-shadow: 0 0 0 0 rgba(30, 41, 59, 0); } }
            `}</style>
        </div>
    );

    return (
        <div style={{ background: 'white', padding: '48px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <button onClick={onBack} style={{ float: 'left', border: 'none', background: '#F3F4F6', color: '#4B5563', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#1E3A8A', marginBottom: '8px' }}>Call Family</h2>
            <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '48px' }}>Who would you like to speak with?</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {contacts.map(c => (
                    <button 
                        key={c._id} 
                        onClick={() => setCalling(c)}
                        style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                            padding: '32px', background: '#FEF2F2', borderRadius: '24px', 
                            border: '2px solid #FEE2E2', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#991B1B' }}>{c.name}</div>
                            <div style={{ fontSize: '14px', color: '#DC2626', fontWeight: '700' }}>ONLINE NOW</div>
                        </div>
                        <div style={{ background: '#EF4444', color: 'white', padding: '12px', borderRadius: '50%' }}>
                            <Phone size={28} fill="white" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Wellness;
