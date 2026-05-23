import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, ChevronLeft, Clock, Info, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Routine = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guideMode, setGuideMode] = useState(false);

    const speakTask = (task) => {
        if ('speechSynthesis' in window && task) {
            window.speechSynthesis.cancel();
            const text = `Next task: ${task.title}. Scheduled for ${task.time}. ${task.description || ""}`;
            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const fetchRoutines = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/routines', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
            return res.data;
        } catch (err) {
            console.error("Error fetching routines", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    useEffect(() => {
        if (guideMode && tasks.length > 0) {
            const nextIncomplete = tasks.find(t => !t.completed);
            if (nextIncomplete) {
                speakTask(nextIncomplete);
            }
        }
    }, [guideMode, tasks]);

    const handleCompleteTask = async (id, title) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/routines/${id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if ('speechSynthesis' in window) {
                const utterance = new window.SpeechSynthesisUtterance(`Excellent! You've completed ${title}.`);
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }

            await fetchRoutines();
        } catch (err) {
            console.error("Error completing routine", err);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 40%, #E2E8F0 100%)', 
            paddingBottom: '80px',
            fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(30,58,138,0.1)', padding: '0 28px',
                height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/dashboard" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: '#1E3A8A', fontWeight: '700', fontSize: '18px', textDecoration: 'none',
                        background: '#FFF', padding: '12px 20px', borderRadius: '12px',
                        border: '1px solid #E2E8F0', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFF'}>
                        <ChevronLeft size={24} /> Back
                    </Link>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1E3A8A', margin: 0 }}>My Daily Routine</h1>
                </div>

                <button
                    onClick={() => setGuideMode(!guideMode)}
                    style={{
                        padding: '12px 24px',
                        background: guideMode ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)' : 'white',
                        color: guideMode ? 'white' : '#1E3A8A',
                        border: '1px solid #E0E7FF',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 12px rgba(30,58,138,0.1)'
                    }}>
                    <Calendar size={20} /> {guideMode ? "View List" : "Guide Me"}
                </button>
            </div>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div style={{ width: '52px', height: '52px', border: '5px solid #E0E7FF', borderTopColor: '#1E3A8A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                        <p style={{ fontSize: '24px', color: '#64748B' }}>Loading your tasks...</p>
                    </div>
                ) : guideMode ? (
                    /* GUIDE MODE */
                    <div style={{ textAlign: 'center' }}>
                        {tasks.filter(t => !t.completed).length === 0 ? (
                            <div style={{ background: 'white', padding: '80px 40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                                <div style={{ width: '120px', height: '120px', background: '#E0E7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                                    <CheckCircle size={64} color="#1E3A8A" />
                                </div>
                                <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#0F172A', marginBottom: '16px' }}>All Done!</h2>
                                <p style={{ fontSize: '22px', color: '#64748B', marginBottom: '40px' }}>You have completed all your tasks for today. Well done!</p>
                                <button onClick={() => setGuideMode(false)} style={{ background: '#1E3A8A', color: 'white', border: 'none', padding: '20px 40px', borderRadius: '16px', fontSize: '20px', fontWeight: '800', cursor: 'pointer' }}>Back to List View</button>
                            </div>
                        ) : (
                            <div style={{ background: 'white', padding: '60px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', borderLeft: '16px solid #1E3A8A' }}>
                                <div style={{ background: '#E0E7FF', color: '#1E3A8A', padding: '8px 20px', borderRadius: '999px', fontSize: '15px', fontWeight: '800', display: 'inline-block', marginBottom: '24px' }}>CURRENT TASK</div>
                                <h2 style={{ fontSize: '56px', fontWeight: '900', color: '#0F172A', marginBottom: '16px', lineHeight: 1.1 }}>{tasks.find(t => !t.completed).title}</h2>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontSize: '28px', color: '#64748B', marginBottom: '32px', fontWeight: '600' }}>
                                    <Clock size={32} /> Scheduled: {tasks.find(t => !t.completed).time}
                                </div>
                                {tasks.find(t => !t.completed).description && (
                                    <p style={{ fontSize: '24px', color: '#4B5563', marginBottom: '48px', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto 48px' }}>"{tasks.find(t => !t.completed).description}"</p>
                                )}
                                <button
                                    onClick={() => handleCompleteTask(tasks.find(t => !t.completed)._id, tasks.find(t => !t.completed).title)}
                                    style={{ 
                                        width: '100%', padding: '32px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', 
                                        color: 'white', border: 'none', borderRadius: '24px', fontSize: '32px', fontWeight: '900', 
                                        cursor: 'pointer', boxShadow: '0 12px 30px rgba(30,58,138,0.3)', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    <CheckCircle size={44} style={{ verticalAlign: 'middle', marginRight: '16px' }} /> I've Done This!
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Summary Card */}
                        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', padding: '32px', borderRadius: '24px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 20px rgba(30,58,138,0.2)' }}>
                            <div>
                                <h3 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Progress Update</h3>
                                <p style={{ fontSize: '18px', margin: '4px 0 0', opacity: 0.9 }}>You've completed {tasks.filter(t => t.completed).length} of {tasks.length} tasks today.</p>
                            </div>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart fill="white" size={40} />
                            </div>
                        </div>

                        {tasks.length === 0 ? (
                            <div style={{ background: 'white', padding: '60px', borderRadius: '32px', textAlign: 'center', border: '2px dashed #CBD5E1' }}>
                                <Info size={64} color="#94A3B8" style={{ marginBottom: '20px' }} />
                                <p style={{ fontSize: '24px', color: '#64748B' }}>No routine tasks set for today.</p>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task._id}
                                    onClick={() => !task.completed && handleCompleteTask(task._id, task.title)}
                                    style={{
                                        background: 'white',
                                        padding: '32px',
                                        borderRadius: '28px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: task.completed ? 'default' : 'pointer',
                                        opacity: task.completed ? 0.8 : 1,
                                        border: `2px solid ${task.completed ? '#E0E7FF' : '#F1F5F9'}`,
                                        boxShadow: task.completed ? 'none' : '0 4px 12px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={e => !task.completed && (e.currentTarget.style.transform = 'translateX(8px)')}
                                    onMouseLeave={e => !task.completed && (e.currentTarget.style.transform = 'translateX(0)')}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <div style={{ background: task.completed ? '#E0E7FF' : '#F3F4F6', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', color: task.completed ? '#1E3A8A' : '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={16} /> {task.time}
                                            </div>
                                            {task.completed && <span style={{ color: '#1E3A8A', fontSize: '14px', fontWeight: '800' }}>✓ TASK COMPLETED</span>}
                                        </div>
                                        <h2 style={{
                                            fontSize: '32px',
                                            fontWeight: '800',
                                            margin: 0,
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            color: task.completed ? '#94A3B8' : '#111827',
                                            lineHeight: 1.2
                                        }}>
                                            {task.title}
                                        </h2>
                                        {task.description && (
                                            <p style={{ fontSize: '18px', marginTop: '12px', color: '#6B7280', fontStyle: 'italic' }}>{task.description}</p>
                                        )}
                                    </div>

                                    <div style={{ paddingLeft: '32px' }}>
                                        {task.completed ? (
                                            <div style={{ width: '72px', height: '72px', background: '#E0E7FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CheckCircle size={44} color="#1E3A8A" />
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                width: '120px', padding: '16px', background: '#F1F5F9', 
                                                borderRadius: '16px', border: '2px solid #E0E7FF', 
                                                color: '#1E3A8A', textAlign: 'center', fontWeight: '800'
                                            }}>
                                                <ArrowRight size={28} style={{ marginBottom: '4px' }} />
                                                <div style={{ fontSize: '16px' }}>Complete</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>
        </div>
    );
};

export default Routine;
