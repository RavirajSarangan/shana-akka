import React, { useEffect, useState } from 'react';
import { Pill, Calendar, Mic, Sparkles, Bell, PhoneCall, MicOff, LogOut, Cloud, Newspaper, Image as ImageIcon, Brain, Settings, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useCall } from '../hooks/useCall';
import CallButton from '../components/CallButton';
import IncomingCall from '../components/IncomingCall';
import axios from 'axios';

const ElderDashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useUI();
    const navigate = useNavigate();

    const [meds, setMeds] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [stats, setStats] = useState({ medications: 0, routines: 0, requests: 0 });
    const [weather, setWeather] = useState({ temp: 28, condition: 'Sunny' });
    const [briefingPlayed, setBriefingPlayed] = useState(false);
    const [familyContacts, setFamilyContacts] = useState([]);

    const { callState, incomingCall, callError, remoteAudioRef, initiateCall, acceptCall, rejectCall, hangUp } = useCall(user?._id || user?.id);

    const handleSOS = async () => {
        try {
            const token = localStorage.getItem('token');
            let location = null;

            if (navigator.geolocation) {
                const pos = await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null));
                });
                if (pos) {
                    location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                }
            }

            await axios.post('/api/alerts/sos', { location }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("EMERGENCY: SOS alert sent to your family with your location!");
            speak("Emergency alert sent. Help is on the way.");
        } catch (err) {
            console.error(err);
            alert("Failed to send SOS. Please try calling directly.");
        }
    };

    const { isListening, lastCommand, toggleListening, speak } = useVoiceAssistant({
        medications: meds,
        routines: routines,
        onEmergency: handleSOS
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const [medsRes, routineRes, requestsRes] = await Promise.all([
                    axios.get('/api/medications', { headers }),
                    axios.get('/api/routines', { headers }),
                    axios.get('/api/family/pending-requests', { headers: { 'x-auth-token': token } })
                ]);

                setMeds(medsRes.data);
                setRoutines(routineRes.data);
                setStats({
                    medications: medsRes.data.filter(m => m.active).length,
                    routines: routineRes.data.filter(r => !r.completed).length,
                    requests: requestsRes.data.length
                });

                // Fetch linked family members for calling
                try {
                    const contactsRes = await axios.get('/api/family/contacts', { headers });
                    setFamilyContacts(contactsRes.data);
                } catch (e) {
                    console.error('Could not load family contacts', e);
                }

                const today = new Date().toDateString();
                const lastBriefing = localStorage.getItem('lastBriefingDate');
                if (lastBriefing !== today && !briefingPlayed) {
                    playMorningBriefing(medsRes.data, routineRes.data);
                    localStorage.setItem('lastBriefingDate', today);
                    setBriefingPlayed(true);
                }
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        if (user) fetchData();
    }, [user, briefingPlayed]);

    const playMorningBriefing = (currentMeds, currentRoutines) => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
        const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        let text = `${greeting}, ${user?.name}. Today is ${dateStr}. `;
        const medsToTake = currentMeds.filter(m => m.active).length;
        const tasksToDo = currentRoutines.filter(r => !r.completed).length;
        text += `You have ${medsToTake} medications scheduled for today, and ${tasksToDo} tasks in your routine. `;
        text += "Remember to stay hydrated and move carefully. I am here if you need any help. Have a wonderful day!";
        speak(text);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5);
            meds.forEach(med => {
                if (med && med.active && med.timings && med.timings.includes(currentTime)) {
                    speak(`It is ${currentTime}. Time to take your ${med.name}.`);
                }
            });
            routines.forEach(task => {
                if (task && !task.completed && task.time === currentTime) {
                    speak(`Reminder: It's time for ${task.title}.`);
                }
            });
            if (now.getMinutes() === 0 && now.getHours() % 2 === 0) {
                speak("Time for a quick wellness check. Please have a glass of water and stretch a little.");
            }
            if (now.getMinutes() === 30 && now.getHours() === 10) {
                speak("Please remember to move carefully around the house.");
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [meds, routines]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 40%, #E2E8F0 100%)', paddingBottom: '200px' }}>

            {/* ── TOP BAR ─────────────────────────────────────── */}
            <div style={{
                background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(30,58,138,0.1)',
                padding: '0 32px', height: '72px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(30,58,138,0.3)' }}>
                        <Heart size={20} fill="white" color="white" />
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: '800', color: '#1E3A8A' }}>ElderEase</span>
                </div>

                {/* Weather chip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E0E7FF', padding: '8px 18px', borderRadius: '999px', border: '1px solid #C7D2FE' }}>
                    <Cloud size={20} color="#1E3A8A" />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E3A8A' }}>{weather.temp}°C · {weather.condition}</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link to="/preferences" style={{
                        width: '42px', height: '42px', background: '#F3F4F6', border: 'none',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6B7280', transition: 'all 0.2s', textDecoration: 'none'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#E0E7FF'; e.currentTarget.style.color = '#1E3A8A'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#6B7280'; }}>
                        <Settings size={20} />
                    </Link>
                    <button onClick={() => { logout(); navigate('/login'); }} style={{
                        width: '42px', height: '42px', background: '#F3F4F6', border: 'none',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6B7280', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#6B7280'; }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* ── HERO GREETING ────────────────────────────────── */}
            <div style={{ textAlign: 'center', padding: '48px 24px 40px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#E0E7FF', color: '#1E3A8A', padding: '7px 20px',
                    borderRadius: '999px', fontSize: '15px', fontWeight: '700',
                    marginBottom: '20px', border: '1px solid #C7D2FE'
                }}>
                    <Heart size={16} fill="#1E3A8A" color="#1E3A8A" />
                    {dateStr}
                </div>

                <h1 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 'clamp(36px, 5vw, 62px)',
                    fontWeight: '900', color: '#0F172A',
                    lineHeight: 1.1, marginBottom: '12px',
                    letterSpacing: '-0.02em'
                }}>
                    {greeting}, <span style={{ color: '#1E3A8A' }}>{user?.name || 'Friend'}!</span>
                </h1>
                <p style={{ fontSize: '22px', color: '#64748B', fontWeight: '500' }}>
                    How are you feeling today? 🌿
                </p>
            </div>

            {/* ── STAT SUMMARY ─────────────────────────────────── */}
            <div style={{ maxWidth: '720px', margin: '0 auto 40px', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                    { label: 'Medications', value: stats.medications, icon: '💊', color: '#1E3A8A', bg: '#E0E7FF' },
                    { label: 'Tasks Today', value: stats.routines, icon: '📅', color: '#1E3A8A', bg: '#E0E7FF' },
                    { label: 'Notifications', value: stats.requests, icon: '🔔', color: '#1E3A8A', bg: '#E0E7FF' },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: 'white', borderRadius: '16px', padding: '20px 16px',
                        textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #E2E8F0'
                    }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── CALL FAMILY ──────────────────────────────────── */}
            {familyContacts.length > 0 && (
                <div style={{ maxWidth: '1100px', margin: '0 auto 32px', padding: '0 24px' }}>
                    <CallButton
                        familyMembers={familyContacts.map(c => ({ ...c, userId: c._id, name: c.name }))}
                        callState={callState}
                        callError={callError}
                        onCall={(targetId, name) => initiateCall(targetId, user?.name || 'Elder')}
                        onHangUp={hangUp}
                        remoteAudioRef={remoteAudioRef}
                    />
                </div>
            )}

            {/* Incoming call overlay */}
            <IncomingCall incomingCall={incomingCall} onAccept={acceptCall} onReject={rejectCall} />

            {/* ── DASHBOARD TILES ───────────────────────────────── */}
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '1100px'
            }}>
                <DashboardTile
                    to="/medications"
                    emoji="💊"
                    title={t('medications')}
                    subtitle={`${stats.medications} active`}
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                />
                <DashboardTile
                    to="/routine"
                    emoji="📅"
                    title={t('routine')}
                    subtitle={`${stats.routines} tasks`}
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                />
                <DashboardTile
                    to="/wellness"
                    emoji="🌿"
                    title={t('relaxation')}
                    subtitle="Relax your mind"
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                />
                <DashboardTile
                    to="/cognitive"
                    emoji="🧠"
                    title={t('cognitive')}
                    subtitle="Memory & Fun"
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                />
                <DashboardTile
                    to="/memory-wall"
                    emoji="📸"
                    title={t('memoryWall')}
                    subtitle="Family Photos"
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                />
                <DashboardTile
                    to="/alerts"
                    emoji="🔔"
                    title={t('notices')}
                    subtitle={stats.requests > 0 ? `${stats.requests} new!` : "All clear"}
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                    pulse={stats.requests > 0}
                />
                <DashboardTile
                    to="/virtual-nurse"
                    emoji="❤️"
                    title="Virtual Nurse"
                    subtitle="Chat & Support"
                    gradientFrom="#1E3A8A" gradientTo="#3B82F6"
                />
            </div>

            {/* ── SOS BUTTON ────────────────────────────────────── */}
            <button onClick={handleSOS} style={{
                position: 'fixed', top: '88px', left: '24px', zIndex: 100,
                background: 'white', border: '4px solid #1E3A8A',
                borderRadius: '18px', padding: '14px 22px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(30,58,138,0.2)',
                transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}>
                <PhoneCall size={36} color="#1E3A8A" />
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E3A8A', letterSpacing: '0.05em' }}>SOS</span>
            </button>

            {/* ── VOICE ASSISTANT ────────────────────────────────── */}
            <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {lastCommand && (
                    <div style={{
                        background: 'rgba(30,58,138,0.9)', color: 'white',
                        padding: '10px 20px', borderRadius: '999px',
                        fontSize: '16px', fontWeight: '600',
                        backdropFilter: 'blur(8px)', maxWidth: '340px', textAlign: 'center'
                    }}>
                        🎤 "{lastCommand}"
                    </div>
                )}
                <button onClick={toggleListening} style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: isListening
                        ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)'
                        : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    border: 'none', cursor: 'pointer', color: 'white',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    boxShadow: isListening
                        ? '0 0 0 0 rgba(30,58,138,0.4)'
                        : '0 8px 28px rgba(30,58,138,0.4)',
                    animation: isListening ? 'sosPulse 1.5s ease infinite' : 'none',
                    transition: 'all 0.3s'
                }}>
                    {isListening ? <MicOff size={44} /> : <Mic size={44} />}
                    <span style={{ fontSize: '15px', fontWeight: '700' }}>{isListening ? 'Stop' : 'Ask Me'}</span>
                </button>
            </div>

            <style>{`
                @keyframes sosPulse {
                    0%   { box-shadow: 0 0 0 0 rgba(30,58,138,0.5); transform: scale(1); }
                    70%  { box-shadow: 0 0 0 22px rgba(30,58,138,0); transform: scale(1.06); }
                    100% { box-shadow: 0 0 0 0 rgba(30,58,138,0); transform: scale(1); }
                }
                @keyframes tilePulse {
                    0%, 100% { box-shadow: 0 4px 16px rgba(30,58,138,0.2); }
                    50% { box-shadow: 0 4px 28px rgba(30,58,138,0.5); }
                }
            `}</style>
        </div>
    );
};

const DashboardTile = ({ to, emoji, title, subtitle, gradientFrom, gradientTo, pulse = false }) => (
    <Link to={to} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '16px', height: '260px',
        background: `linear-gradient(145deg, ${gradientFrom}, ${gradientTo})`,
        borderRadius: '24px', textDecoration: 'none', color: 'white',
        boxShadow: `0 8px 24px ${gradientFrom}40`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        animation: pulse ? 'tilePulse 2s ease infinite' : 'none',
        position: 'relative', overflow: 'hidden'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 20px 40px ${gradientFrom}50`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = `0 8px 24px ${gradientFrom}40`; }}>
        {/* Decorative soft circle */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

        <div style={{ fontSize: '60px', lineHeight: 1, position: 'relative', zIndex: 1 }}>{emoji}</div>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.82)', margin: '6px 0 0', fontWeight: '500' }}>{subtitle}</p>
        </div>
    </Link>
);

export default ElderDashboard;
