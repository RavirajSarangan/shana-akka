import React, { useState, useEffect } from 'react';
import {
    BarChart3, Pill, Calendar, AlertCircle, ClipboardList,
    Settings, LogOut, User, Plus, CheckCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FamilyDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [meds, setMeds] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [showMedForm, setShowMedForm] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', dosage: '', timings: '', instructions: '' });
    const [showRoutineForm, setShowRoutineForm] = useState(false);
    const [newRoutine, setNewRoutine] = useState({ title: '', time: '', description: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [medRes, routineRes] = await Promise.all([
                    axios.get('/api/medications', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/routines', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setMeds(medRes.data);
                setRoutines(routineRes.data);
            } catch (err) {
                console.error("Error fetching family data", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddMed = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/medications', {
                ...newMed,
                timings: newMed.timings.split(',').map(t => t.trim()),
                elderId: meds[0]?.elder // In real app, we'd have a list of elders
            }, { headers: { Authorization: `Bearer ${token}` } });
            setMeds([...meds, res.data]);
            setShowMedForm(false);
            setNewMed({ name: '', dosage: '', timings: '', instructions: '' });
        } catch (err) {
            alert("Failed to add medication");
        }
    };

    const handleAddRoutine = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/routines', {
                ...newRoutine,
                elderId: meds[0]?.elder
            }, { headers: { Authorization: `Bearer ${token}` } });
            setRoutines([...routines, res.data]);
            setShowRoutineForm(false);
            setNewRoutine({ title: '', time: '', description: '' });
        } catch (err) {
            alert("Failed to add routine");
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: '#1E3A8A',
                color: 'white',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 20px rgba(30, 58, 138, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                    <div style={{ width: '38px', height: '38px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={22} color="#1E3A8A" fill="#1E3A8A" />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: "'Outfit', sans-serif" }}>ElderEase</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <SidebarLink
                        icon={<BarChart3 size={20} />}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarLink
                        icon={<Pill size={20} />}
                        label="Medications"
                        active={activeTab === 'meds'}
                        onClick={() => setActiveTab('meds')}
                    />
                    <SidebarLink
                        icon={<Calendar size={20} />}
                        label="Routines"
                        active={activeTab === 'routines'}
                        onClick={() => setActiveTab('routines')}
                    />
                    <SidebarLink
                        icon={<ClipboardList size={20} />}
                        label="Health Notes"
                        active={activeTab === 'notes'}
                        onClick={() => setActiveTab('notes')}
                    />
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                    <SidebarLink icon={<Settings size={20} />} label="Settings" />
                    <SidebarLink icon={<LogOut size={20} />} label="Logout" onClick={handleLogout} />
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '48px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1E3A8A', fontFamily: "'Outfit', sans-serif", marginBottom: '4px' }}>Care Monitor</h1>
                        <p style={{ color: '#64748B', fontWeight: '500' }}>Real-time stability monitoring</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: '800', color: '#1E293B' }}>{user?.name}</p>
                            <p style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Family Coordinator</p>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A8A', border: '1px solid #C7D2FE' }}>
                            <User size={24} />
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                            <StatusCard title="Med Adherence" status="On Track" color="#10B981" value={`${Math.round((meds.filter(m => m.logs?.some(l => l.status === 'Taken')).length / (meds.length || 1)) * 100)}%`} />
                            <StatusCard title="Routine Progress" status="Active" color="#F59E0B" value={`${routines.filter(r => r.completed).length}/${routines.length}`} />
                            <StatusCard title="Safety Status" status="Safe" color="#10B981" value="Normal" />
                            <StatusCard title="System Sync" status="Live" color="#3B82F6" value="Synced" />
                        </div>

                        <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0', background: 'white' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E293B', marginBottom: '24px' }}>Recent Activity Log</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {meds.flatMap(m => m.logs || []).sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt)).slice(0, 5).map((log, i) => (
                                    <AdherenceItem key={i} time={new Date(log.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} task={`Medicine: ${log.status}`} status={log.status} />
                                ))}
                                {routines.filter(r => r.completed).slice(0, 3).map((r, i) => (
                                    <AdherenceItem key={i} time="Today" task={`Routine: ${r.title}`} status="Done" color="#3B82F6" />
                                ))}
                                {meds.length === 0 && routines.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No activity recorded yet.</div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'meds' && (
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B' }}>Medication Management</h3>
                            <button onClick={() => setShowMedForm(!showMedForm)} style={{
                                background: '#1E3A8A', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                            }}>
                                <Plus size={20} /> Add Medication
                            </button>
                        </div>

                        {showMedForm && (
                            <form onSubmit={handleAddMed} style={{ marginBottom: '40px', padding: '28px', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '20px', display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input placeholder="Medication Name" required value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none' }} />
                                    <input placeholder="Dosage (e.g. 500mg)" required value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <input placeholder="Timings (e.g. 08:00 AM, 08:00 PM)" required value={newMed.timings} onChange={e => setNewMed({ ...newMed, timings: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none' }} />
                                <textarea placeholder="Instructions" value={newMed.instructions} onChange={e => setNewMed({ ...newMed, instructions: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none', minHeight: '100px' }} />
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowMedForm(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#E2E8F0', color: '#475569', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#1E3A8A', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Save Medication</button>
                                </div>
                            </form>
                        )}

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {meds.map(med => (
                                <div key={med._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>{med.name}</h4>
                                        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{med.dosage} • {med.timings?.join(', ')}</p>
                                    </div>
                                    <div style={{ color: '#10B981', fontSize: '14px', fontWeight: '800', background: '#DCFCE7', padding: '6px 14px', borderRadius: '999px' }}>Active</div>
                                </div>
                            ))}
                            {meds.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No medications listed.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'routines' && (
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B' }}>Daily Routine Tasks</h3>
                            <button onClick={() => setShowRoutineForm(!showRoutineForm)} style={{
                                background: '#1E3A8A', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                            }}>
                                <Plus size={20} /> Add Task
                            </button>
                        </div>

                        {showRoutineForm && (
                            <form onSubmit={handleAddRoutine} style={{ marginBottom: '40px', padding: '28px', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '20px', display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input placeholder="Task Title" required value={newRoutine.title} onChange={e => setNewRoutine({ ...newRoutine, title: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none' }} />
                                    <input placeholder="Time (e.g. 07:00 AM)" required value={newRoutine.time} onChange={e => setNewRoutine({ ...newRoutine, time: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <textarea placeholder="Description" value={newRoutine.description} onChange={e => setNewRoutine({ ...newRoutine, description: e.target.value })} style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none', minHeight: '100px' }} />
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowRoutineForm(false)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#E2E8F0', color: '#475569', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#1E3A8A', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Save Task</button>
                                </div>
                            </form>
                        )}

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {routines.map(task => (
                                <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>{task.title}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
                                            <Clock size={14} /> {task.time}
                                        </div>
                                    </div>
                                    <div style={{ color: task.completed ? '#10B981' : '#F59E0B', fontSize: '14px', fontWeight: '800', background: task.completed ? '#DCFCE7' : '#FEF3C7', padding: '6px 14px', borderRadius: '999px' }}>
                                        {task.completed ? 'Completed' : 'Pending'}
                                    </div>
                                </div>
                            ))}
                            {routines.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No routine tasks scheduled.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="glass-card" style={{ padding: '48px', borderRadius: '24px', border: '1px solid #E2E8F0', background: 'white', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: '#F8FAFC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#94A3B8' }}>
                            <ClipboardList size={32} />
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>Health Notes & Observations</h3>
                        <p style={{ color: '#64748B', maxWidth: '380px', margin: '0 auto', lineHeight: 1.6 }}>No health notes recorded yet. Notes added by the elder will appear here for your review.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
        color: active ? 'white' : 'rgba(255,255,255,0.7)',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: active ? '700' : '500',
        transition: 'all 0.2s'
    }}
    onMouseEnter={e => { if(!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
    onMouseLeave={e => { if(!active) e.currentTarget.style.background = 'transparent'; }}>
        {icon} <span>{label}</span>
    </div>
);

const StatusCard = ({ title, status, color, value }) => (
    <div className="glass-card" style={{ padding: '28px', borderRadius: '24px', background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>{title}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
                <h4 style={{ fontSize: '32px', fontWeight: '900', color: '#1E293B', margin: 0, lineHeight: 1 }}>{value}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
                    <span style={{ color: color, fontSize: '14px', fontWeight: '800' }}>{status}</span>
                </div>
            </div>
        </div>
    </div>
);

const AdherenceItem = ({ time, task, status, color = "#10B981" }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: '#1E3A8A', fontSize: '14px', minWidth: '80px' }}>{time}</span>
            <span style={{ fontWeight: '600', color: '#334155' }}>{task}</span>
        </div>
        <span style={{ color: color, fontWeight: '800', fontSize: '14px' }}>{status}</span>
    </div>
);

export default FamilyDashboard;
