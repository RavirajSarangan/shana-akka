import React, { useEffect, useState } from 'react';
import { Pill, Calendar, Mic, Sparkles, Bell, PhoneCall, MicOff, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ElderDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isListening, lastCommand, toggleListening } = useVoiceAssistant();
    const [stats, setStats] = useState({ medications: 0, routines: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const medsRes = await axios.get('/api/medications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const routineRes = await axios.get('/api/routines', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats({
                    medications: medsRes.data.filter(m => m.active).length,
                    routines: routineRes.data.filter(r => !r.completed).length
                });
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="elder-mode" style={{ minHeight: '100vh', background: 'var(--secondary-color)', padding: '40px 20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                <h1>Good Day, {user?.name || 'Friend'}!</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '24px' }}>It's {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

                <button onClick={handleLogout} style={{
                    position: 'absolute', top: '0', right: '0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)'
                }}>
                    <LogOut size={24} /> Logout
                </button>

                {lastCommand && (
                    <div className="glass-card" style={{ display: 'inline-block', padding: '10px 20px', marginTop: '10px', fontSize: '18px' }}>
                        I heard: "<strong>{lastCommand}</strong>"
                    </div>
                )}
            </header>

            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px',
                paddingBottom: '120px'
            }}>
                <DashboardTile
                    to="/elder/medications"
                    icon={<Pill size={80} />}
                    title="Medications"
                    subtitle={`${stats.medications} items to track`}
                    color="#E74C3C"
                />
                <DashboardTile
                    to="/elder/routine"
                    icon={<Calendar size={80} />}
                    title="My Routine"
                    subtitle={`${stats.routines} tasks remaining`}
                    color="#3498DB"
                />
                <DashboardTile
                    to="/elder/wellness"
                    icon={<Sparkles size={80} />}
                    title="Relaxation"
                    subtitle="Time for yourself"
                    color="#9B59B6"
                />
                <DashboardTile
                    to="/elder/alerts"
                    icon={<Bell size={80} />}
                    title="Alerts"
                    subtitle="Check your notices"
                    color="#F1C40F"
                />
            </div>

            {/* Floating Voice Assistant Button */}
            <div style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100
            }}>
                <button
                    onClick={toggleListening}
                    className="big-button"
                    style={{
                        borderRadius: '50%',
                        width: '120px',
                        height: '120px',
                        background: isListening ? '#E74C3C' : 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        animation: isListening ? 'pulse 1.5s infinite' : 'none'
                    }}
                >
                    {isListening ? <MicOff size={50} /> : <Mic size={50} />}
                    <span style={{ fontSize: '14px' }}>{isListening ? 'Stop' : 'Ask Me'}</span>
                </button>
            </div>

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(231, 76, 60, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
      `}</style>

            {/* Emergency Button */}
            <button className="big-button emergency" style={{
                position: 'fixed',
                top: '30px',
                left: '30px',
                padding: '15px 25px',
                fontSize: '20px'
            }}>
                <PhoneCall size={32} />
                SOS
            </button>
        </div>
    );
};

const DashboardTile = ({ to, icon, title, subtitle, color }) => (
    <Link to={to} className="big-button" style={{ height: '300px', borderColor: color }}>
        <div style={{ color: color }}>{icon}</div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <h2 style={{ fontSize: '32px' }}>{title}</h2>
            <p style={{ fontSize: '20px', fontWeight: 'normal', color: 'var(--text-light)' }}>{subtitle}</p>
        </div>
    </Link>
);

export default ElderDashboard;
