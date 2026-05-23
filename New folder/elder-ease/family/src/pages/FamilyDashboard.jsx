import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity,
    Bell,
    User,
    Clipboard,
    Plus,
    Heart,
    AlertCircle,
    Calendar,
    LogOut,
    Clock,
    XCircle,
    Mail,
    ChevronRight,
    MessageSquare,
    AlertTriangle,
    Shield,
    Image as ImageIcon,
    Zap,
    MapPin,
    Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoutinePage from './Routine';
import { useCall } from '../hooks/useCall';
import IncomingCall from '../components/IncomingCall';

const FamilyDashboard = () => {
    const { user, logout } = useAuth();
    const [elders, setElders] = useState([]);
    const [selectedElder, setSelectedElder] = useState(null);
    const [summary, setSummary] = useState(null);
    const [notes, setNotes] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLinking, setIsLinking] = useState(false);
    const [linkEmail, setLinkEmail] = useState('');
    const [showAddMed, setShowAddMed] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddAppointment, setShowAddAppointment] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);
    const [showAddRoutine, setShowAddRoutine] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // New Memory Wall State
    const [showAddMemory, setShowAddMemory] = useState(false);
    const [newMemory, setNewMemory] = useState({ title: '', contentUrl: '', caption: '', contentType: 'Image' });

    // Forms
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'Daily', timings: '08:00', instructions: '', stock: 0, refillThreshold: 5 });
    const [newTask, setNewTask] = useState({ title: '', time: '08:00', description: '' });
    const [newNote, setNewNote] = useState({ title: '', content: '', noteType: 'Observation', visibility: 'FamilyMember', priority: 'Medium', schedule: new Date().toISOString().slice(0,16) });
    const [newAppointment, setNewAppointment] = useState({ title: '', date: '', description: '', location: '', type: 'Doctor' });
    const [newRoutine, setNewRoutine] = useState({ title: '', description: '', time: '08:00', date: new Date().toISOString().slice(0,10), repeatType: 'once' });

    const authHeaders = { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'x-auth-token': localStorage.getItem('token') } };

    const { callState, incomingCall, callError, remoteAudioRef, acceptCall, rejectCall, hangUp } = useCall(user?._id || user?.id);

    useEffect(() => { fetchElders(); }, []);
    useEffect(() => {
        if (selectedElder) {
            fetchSummary(selectedElder._id);
            fetchNotes(selectedElder._id);
        }
    }, [selectedElder]);

    const fetchElders = async () => {
        try {
            const res = await axios.get('/api/family/elders', authHeaders);
            setElders(res.data);
            if (res.data.length > 0) setSelectedElder(res.data[0]);
        } catch (err) { console.error(err); }
    };

    const fetchSummary = async (id) => {
        try {
            const res = await axios.get(`/api/family/elders/${id}/summary`, authHeaders);
            setSummary(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchNotes = async (id) => {
        try {
            const res = await axios.get(`/api/family/notes/${id}`, authHeaders);
            setNotes(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAddMed = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/medications', { ...newMed, timings: [newMed.timings], elderId: selectedElder._id }, authHeaders);
            setShowAddMed(false);
            setNewMed({ name: '', dosage: '', frequency: 'Daily', timings: '08:00', instructions: '', stock: 0, refillThreshold: 5 });
            fetchSummary(selectedElder._id);
            setRefreshTrigger(prev => prev + 1);
            showTempMessage('success', 'Medication added');
        } catch (err) { showTempMessage('error', 'Failed to add medication'); }
    };

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/appointments', { ...newAppointment, elder: selectedElder._id }, authHeaders);
            setShowAddAppointment(false);
            setNewAppointment({ title: '', date: '', description: '', location: '', type: 'Doctor' });
            setRefreshTrigger(prev => prev + 1);
            showTempMessage('success', 'Appointment scheduled');
        } catch (err) { showTempMessage('error', 'Failed to schedule appointment'); }
    };

    const handleAddMemory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/memory-wall', { ...newMemory, elder: selectedElder._id }, authHeaders);
            setShowAddMemory(false);
            setNewMemory({ title: '', contentUrl: '', caption: '', contentType: 'Image' });
            setRefreshTrigger(prev => prev + 1);
            showTempMessage('success', 'Memory uploaded to wall');
        } catch (err) { showTempMessage('error', 'Failed to upload memory'); }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const notePayload = { ...newNote, elderId: selectedElder._id };
            await axios.post('/api/family/notes', notePayload, authHeaders);

            // If this care note is actually a routine, also create a Routine record
            if (notePayload.noteType === 'Routine') {
                try {
                    const schedule = notePayload.schedule || new Date().toISOString();
                    const [datePart, timePart] = schedule.split('T');
                    const time = timePart ? timePart.slice(0,5) : '';
                    const date = datePart ? datePart : undefined;

                    await axios.post('/api/routines', {
                        elderId: selectedElder._id,
                        title: notePayload.title || 'Routine Task',
                        description: notePayload.content,
                        time,
                        date
                    }, authHeaders);
                } catch (routineErr) {
                    console.error('Failed to create routine from care note', routineErr);
                }
            }

            setShowAddNote(false);
            setNewNote({ title: '', content: '', noteType: 'Observation', visibility: 'FamilyMember', priority: 'Medium', schedule: new Date().toISOString().slice(0,16) });
            setRefreshTrigger(prev => prev + 1);
            fetchNotes(selectedElder._id);
            fetchSummary(selectedElder._id);
            showTempMessage('success', 'Care note saved');
        } catch (err) { showTempMessage('error', 'Failed to save care note'); }
    };

    const handleAddRoutine = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/routines', { 
                ...newRoutine, 
                elderId: selectedElder._id,
                date: newRoutine.date ? new Date(newRoutine.date).toISOString() : undefined
            }, authHeaders);
            setShowAddRoutine(false);
            setNewRoutine({ title: '', description: '', time: '08:00', date: new Date().toISOString().slice(0,10), repeatType: 'once' });
            setRefreshTrigger(prev => prev + 1);
            fetchSummary(selectedElder._id);
            showTempMessage('success', 'Routine added successfully');
        } catch (err) { 
            showTempMessage('error', err.response?.data?.message || 'Failed to add routine'); 
        }
    };

    const handleLinkRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/family/link-request', { elderEmail: linkEmail }, authHeaders);
            setIsLinking(false);
            setLinkEmail('');
            showTempMessage('success', 'Link request sent to elder');
        } catch (err) { showTempMessage('error', err.response?.data?.msg || 'Failed to send request'); }
    };

    const showTempMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // AI Insights Logic
    const getAIInsights = () => {
        if (!summary) return ["Loading data..."];
        const insights = [];
        if (summary.medsMissed > 0) insights.push("Pattern Alert: Morning medication missed frequently.");
        if (summary.routinePercent < 50) insights.push("Activity Alert: Daily routine completion is lower than usual.");
        if (summary.medsDue > 5) insights.push("Reminder: Multiple routine activities pending for the afternoon.");
        if (insights.length === 0) insights.push("System Status: All routines and medications are being followed perfectly!");
        return insights;
    };

    return (
        <div style={{ height: '100vh', display: 'flex', background: '#F8F9FC', fontFamily: "'Outfit', sans-serif" }}>
            {/* Call overlay */}
            <IncomingCall
                incomingCall={incomingCall}
                callState={callState}
                onAccept={acceptCall}
                onReject={rejectCall}
                onHangUp={hangUp}
                remoteAudioRef={remoteAudioRef}
            />

            {/* Sidebar */}
            <div style={{ width: '280px', background: '#FFF', borderRight: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                    <div style={{ background: '#1E3A8A', padding: '8px', borderRadius: '10px' }}>
                        <Heart size={24} color="#FFF" />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1E3A8A' }}>ElderEase</h1>
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem icon={<Activity size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={<Clipboard size={20} />} label="Medications" active={activeTab === 'meds'} onClick={() => setActiveTab('meds')} />
                    <SidebarItem icon={<Calendar size={20} />} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
                    <SidebarItem icon={<ImageIcon size={20} />} label="Memory Wall" active={activeTab === 'memories'} onClick={() => setActiveTab('memories')} />
                    <SidebarItem icon={<Bell size={20} />} label="Alerts" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} />
                    <SidebarItem icon={<MessageSquare size={20} />} label="Care Notes" active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
                    <SidebarItem icon={<Calendar size={20} />} label="Routines" active={activeTab === 'routines'} onClick={() => setActiveTab('routines')} />
                    <SidebarItem icon={<User size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>

                <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', padding: '12px', cursor: 'pointer', fontWeight: '600' }}>
                    <LogOut size={20} /> Logout
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <header style={{ padding: '20px 40px', background: '#FFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>
                            {selectedElder ? `${selectedElder.name}'s Health` : 'Family Dashboard'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {elders.length > 0 && (
                            <select
                                value={selectedElder?._id}
                                onChange={(e) => setSelectedElder(elders.find(el => el && el._id === e.target.value))}
                                style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8F9FC', fontWeight: '500' }}>
                                {elders.map(e => e && <option key={e._id} value={e._id}>{e.name}</option>)}
                            </select>
                        )}
                        <button onClick={() => setIsLinking(true)} style={{ background: '#1E3A8A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                            <Plus size={18} /> Link Elder
                        </button>
                    </div>
                </header>

                <main style={{ padding: '40px' }}>
                    {message.text && (
                        <div style={{ padding: '12px 20px', borderRadius: '8px', marginBottom: '24px', background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: message.type === 'success' ? '#059669' : '#DC2626', border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {message.type === 'success' ? <Heart size={18} /> : <AlertTriangle size={18} />}
                            {message.text}
                        </div>
                    )}

                    {selectedElder && (
                        <>
                            {activeTab === 'overview' && (
                                <div>
                                    {/* AI Powered Health Insights */}
                                    <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', padding: '30px', borderRadius: '20px', marginBottom: '40px', color: '#FFF', position: 'relative', overflow: 'hidden' }}>
                                        <Zap style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }} size={200} />
                                        <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Zap size={24} fill="#FFF" /> AI Health Insights
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {getAIInsights().map((insight, idx) => (
                                                <div key={idx} style={{ background: 'rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', fontSize: '15px' }}>
                                                    {insight}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                                        <StatCard title="Med Adherence" value={summary ? `${Math.round((summary.medsTaken / (summary.medsTaken + summary.medsDue + summary.medsMissed || 1)) * 100)}%` : '...'} color="#1E3A8A" icon={<Shield size={20} />} />
                                        <StatCard title="Routine" value={summary ? `${Math.round(summary.routinePercent)}%` : '...'} color="#10B981" icon={<Calendar size={20} />} />
                                        <StatCard title="Alerts" value={summary?.recentAlerts?.length || 0} color="#EF4444" icon={<Bell size={20} />} />
                                        <StatCard title="Last Activity" value={summary ? new Date(summary.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'} color="#F59E0B" icon={<Clock size={20} />} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <DashboardBox title="Quick Actions">
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <button onClick={() => setShowAddMed(true)} style={actionBtnStyle}><Clipboard /> Add Medicine</button>
                                                <button onClick={() => setShowAddAppointment(true)} style={actionBtnStyle}><Calendar /> Schedule Visit</button>
                                                <button onClick={() => setShowAddMemory(true)} style={actionBtnStyle}><ImageIcon /> Post Memory</button>
                                                <button onClick={() => setShowAddRoutine(true)} style={actionBtnStyle}><Calendar /> Add Routine</button>
                                            </div>
                                        </DashboardBox>
                                        <DashboardBox title="Recent Activity">
                                            {summary?.recentAlerts?.slice(0, 3).map((a, i) => (
                                                <div key={i} style={{ padding: '10px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' }}>
                                                    <strong>{a.title}</strong>: {a.message}
                                                </div>
                                            ))}
                                        </DashboardBox>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'meds' && <MedicationList key={`meds-${refreshTrigger}`} elderId={selectedElder._id} authHeaders={authHeaders} onAdd={() => setShowAddMed(true)} />}
                            {activeTab === 'appointments' && <AppointmentList key={`apps-${refreshTrigger}`} elderId={selectedElder._id} authHeaders={authHeaders} onAdd={() => setShowAddAppointment(true)} />}
                            {activeTab === 'memories' && <MemoryWallList key={`mems-${refreshTrigger}`} elderId={selectedElder._id} authHeaders={authHeaders} onAdd={() => setShowAddMemory(true)} />}
                            {activeTab === 'notes' && <CareNotesSection key={`notes-${refreshTrigger}`} elderId={selectedElder._id} authHeaders={authHeaders} onAdd={() => setShowAddNote(true)} />}
                            {activeTab === 'routines' && <RoutinePage key={`rout-${refreshTrigger}`} elderId={selectedElder._id} elderName={selectedElder.name} authHeaders={authHeaders} onAdd={() => setShowAddRoutine(true)} refreshTrigger={refreshTrigger} />}
                            {activeTab === 'alerts' && <AlertsSection summary={summary} />}
                            {activeTab === 'settings' && <FamilySettingsView user={user} showMessage={showTempMessage} />}
                        </>
                    )}
                </main>
            </div>

            {/* Modals */}
            {isLinking && <Modal title="Link Elder" onClose={() => setIsLinking(false)}><form onSubmit={handleLinkRequest}><input type="email" placeholder="Email" value={linkEmail} onChange={e => setLinkEmail(e.target.value)} style={inputStyle} /><button type="submit" style={btnStyle}>Send Request</button></form></Modal>}
            {showAddMed && <Modal title="Add Medication" onClose={() => setShowAddMed(false)}><AddMedForm onComplete={handleAddMed} state={newMed} setState={setNewMed} /></Modal>}
            {showAddAppointment && <Modal title="Schedule Appointment" onClose={() => setShowAddAppointment(false)}><AddAppointmentForm onComplete={handleAddAppointment} state={newAppointment} setState={setNewAppointment} /></Modal>}
            {showAddMemory && <Modal title="Post a Memory" onClose={() => setShowAddMemory(false)}><AddMemoryForm onComplete={handleAddMemory} state={newMemory} setState={setNewMemory} /></Modal>}
            {showAddNote && <Modal title="Add Care Note" onClose={() => setShowAddNote(false)}><AddNoteForm onComplete={handleAddNote} state={newNote} setState={setNewNote} /></Modal>}
            {showAddRoutine && <Modal title="Add Daily Routine" onClose={() => setShowAddRoutine(false)}><AddRoutineForm onComplete={handleAddRoutine} state={newRoutine} setState={setNewRoutine} /></Modal>}
        </div>
    );
};

// --- Helper Components & Styles ---

const actionBtnStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#F8F9FC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', color: '#1E293B', transition: 'all 0.2s' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '15px' };
const btnStyle = { width: '100%', padding: '12px', borderRadius: '10px', background: '#1E3A8A', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' };

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', background: active ? '#E0E7FF' : 'transparent', color: active ? '#1E3A8A' : '#64748B', fontWeight: active ? '600' : '400', marginBottom: '4px' }}>
        {icon} <span style={{ fontSize: '15px' }}>{label}</span>
    </div>
);

const StatCard = ({ title, value, color, icon }) => (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><div style={{ color: '#64748B', fontSize: '12px', fontWeight: 'bold' }}>{title}</div><div style={{ color }}>{icon}</div></div>
        <div style={{ fontSize: '24px', fontWeight: '800' }}>{value}</div>
    </div>
);

const DashboardBox = ({ title, children }) => (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <h4 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '700' }}>{title}</h4>
        {children}
    </div>
);

const Modal = ({ title, children, onClose }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '550px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}><h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{title}</h3><XCircle onClick={onClose} style={{ cursor: 'pointer', color: '#94A3B8' }} /></div>
            {children}
        </div>
    </div>
);

const MedicationList = ({ elderId, authHeaders, onAdd }) => {
    const [meds, setMeds] = useState([]);
    useEffect(() => {
        axios.get(`/api/medications?elderId=${elderId}`, authHeaders).then(res => setMeds(res.data || []));
    }, [elderId]);

    const handleDelete = async (medId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`/api/medications/${medId}`, authHeaders);
                setMeds(meds.filter(m => m._id !== medId));
                alert('Medication entry was deleted successfully.');
            } catch (err) {
                console.error('Failed to delete medication', err);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Current Medications</h3>
                <button onClick={onAdd} style={{ padding: '8px 16px', background: '#1E3A8A', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                    + Add Medicine
                </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {meds.map(m => m && (
                    <div key={m._id} style={{ background: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{m.name}</div>
                                <div style={{ color: '#64748B' }}>{m.dosage}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Stock: {m.stock}</span>
                            <span style={{ color: m.stock <= m.refillThreshold ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>
                                {m.stock <= m.refillThreshold ? 'Refill Soon!' : 'OK'}
                            </span>
                        </div>
                        <button onClick={() => handleDelete(m._id)} style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#FEE2E2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <XCircle size={18} /> Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AppointmentList = ({ elderId, authHeaders, onAdd }) => {
    const [apps, setApps] = useState([]);
    useEffect(() => {
        axios.get(`/api/appointments/${elderId}`, authHeaders).then(res => setApps(res.data));
    }, [elderId]);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3>Medical Calendar</h3><button onClick={onAdd} style={{ padding: '8px 16px', background: '#1E3A8A', color: 'white', borderRadius: '8px', border: 'none' }}>+ New Visit</button></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {(apps || []).map(a => a && (
                    <div key={a._id} style={{ background: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ background: '#EEF2FF', padding: '15px', borderRadius: '12px', textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{new Date(a.date).getDate()}</div>
                            <div style={{ fontSize: '12px' }}>{new Date(a.date).toLocaleString('default', { month: 'short' })}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>{a.title}</div>
                            <div style={{ fontSize: '14px', color: '#64748B' }}><Stethoscope size={14} /> {a.type} • <MapPin size={14} /> {a.location}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MemoryWallList = ({ elderId, authHeaders, onAdd }) => {
    const [memories, setMemories] = useState([]);
    useEffect(() => {
        axios.get(`/api/memory-wall/${elderId}`, authHeaders).then(res => setMemories(res.data));
    }, [elderId]);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h3>Memory Wall</h3><button onClick={onAdd} style={{ padding: '8px 16px', background: '#1E3A8A', color: 'white', borderRadius: '8px', border: 'none' }}>+ Upload Memory</button></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {(memories || []).map(m => m && (
                    <div key={m._id} style={{ background: '#FFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                        <img src={m.contentUrl} alt={m.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '15px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{m.title}</div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>{m.caption}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CareNotesSection = ({ elderId, authHeaders, onAdd }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        axios.get(`/api/family/notes/${elderId}`, authHeaders)
             .then(res => setNotes(res.data || []))
             .finally(() => setLoading(false));
    }, [elderId]);

    const getCategoryStyles = (type) => {
        switch (type) {
            case 'Observation': return { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE', icon: <Activity size={14} /> };
            case 'Medication': return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF', icon: <Clipboard size={14} /> };
            case 'Mood': return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', icon: <Heart size={14} /> };
            case 'Emergency': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', icon: <AlertTriangle size={14} /> };
            case 'Routine': return { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA', icon: <Clock size={14} /> };
            default: return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB', icon: <MessageSquare size={14} /> };
        }
    };

    const getPriorityColor = (p) => {
        if (p === 'Urgent') return '#EF4444';
        if (p === 'High') return '#F59E0B';
        if (p === 'Medium') return '#3B82F6';
        return '#10B981';
    };

    const filteredNotes = notes.filter(n => 
        (n.title?.toLowerCase().includes(searchTerm.toLowerCase()) || n.content?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === 'All' || n.noteType === filterType)
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>Care Log & Observations</h2>
                    <p style={{ color: '#64748B', fontSize: '16px' }}>Track health updates, behavioural observations and important care information.</p>
                </div>
                <button onClick={onAdd} style={{ 
                    padding: '12px 24px', 
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
                    transition: 'transform 0.2s'
                }}>
                    <Plus size={20} /> Add Care Note
                </button>
            </div>

            {/* Filters & Search */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94A3B8' }} />
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontSize: '15px', outline: 'none' }}
                    />
                </div>
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ padding: '0 16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: '600', color: '#1E293B', outline: 'none' }}>
                    <option value="All">All Categories</option>
                    <option value="Observation">Observations</option>
                    <option value="Medication">Medications</option>
                    <option value="Mood">Mood/Behaviour</option>
                    <option value="Emergency">Emergencies</option>
                    <option value="Routine">Routine</option>
                </select>
                <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', color: '#1E293B', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clipboard size={18} /> Filter
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>Loading archive...</div>
            ) : filteredNotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
                    <div style={{ background: '#F8F9FC', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <MessageSquare size={32} color="#94A3B8" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>No notes found</h3>
                    <p style={{ color: '#64748B' }}>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    {filteredNotes.map(note => {
                        const style = getCategoryStyles(note.noteType);
                        return (
                            <div key={note._id} style={{ 
                                background: 'white', 
                                padding: '28px', 
                                borderRadius: '20px', 
                                border: '1px solid #F1F5F9', 
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ 
                                            background: style.bg, 
                                            color: style.text, 
                                            padding: '6px 14px', 
                                            borderRadius: '20px', 
                                            fontSize: '13px', 
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            border: `1px solid ${style.border}`
                                        }}>
                                            {style.icon} {note.noteType}
                                        </div>
                                        <div style={{ width: '4px', height: '4px', background: '#CBD5E1', borderRadius: '50%' }}></div>
                                        <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
                                            {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MessageSquare size={18} /></button>
                                        <button style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><XCircle size={18} /></button>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>{note.title || 'Care Update'}</h3>
                                <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{note.content}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                                    <div style={{ display: 'flex', items: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#1E3A8A' }}>
                                            {note.authorId?.name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>{note.authorId?.name || 'Care Team'}</div>
                                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Author</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Shield size={14} /> {note.visibility === 'FamilyMember' ? 'Family Member' : note.visibility === 'Elder' ? 'Elder' : 'Family & Elder both'}
                                        </div>
                                        <div style={{ 
                                            background: `${getPriorityColor(note.priority)}15`, 
                                            color: getPriorityColor(note.priority), 
                                            padding: '4px 10px', 
                                            borderRadius: '6px', 
                                            fontSize: '12px', 
                                            fontWeight: '800',
                                            border: `1px solid ${getPriorityColor(note.priority)}35`
                                        }}>
                                            {note.priority} Priority
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const AddNoteForm = ({ onComplete, state, setState }) => (
    <form onSubmit={onComplete}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Split row for Category and Visibility */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Category</label>
                    <select 
                        style={{ ...inputStyle, marginBottom: 0, paddingLeft: '12px' }} 
                        value={state.noteType} 
                        onChange={e => setState({ ...state, noteType: e.target.value })}>
                        <option value="Observation">📝 General Observation</option>
                        <option value="Medication">💊 Medication Reaction</option>
                        <option value="Mood">😊 Mood / Behaviour</option>
                        <option value="Emergency">🚨 Emergency Note</option>
                        <option value="Routine">📅 Daily Routine</option>
                        <option value="Physical Health">🩺 Physical Health</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Visibility</label>
                    <select 
                        style={{ ...inputStyle, marginBottom: 0, paddingLeft: '12px' }} 
                        value={state.visibility} 
                        onChange={e => setState({ ...state, visibility: e.target.value })}>
                        <option value="FamilyMember">👥 Family Member</option>
                        <option value="Elder">👴 Elder</option>
                        <option value="Both">🌎 Family & Elder both</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Note Title</label>
                <input 
                    placeholder="Briefly describe the update" 
                    style={{ ...inputStyle, marginBottom: 0 }} 
                    value={state.title} 
                    onChange={e => setState({ ...state, title: e.target.value })} 
                    required 
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Note Description</label>
                <textarea 
                    placeholder="Detailed observations or instructions..." 
                    style={{ ...inputStyle, minHeight: '140px', marginBottom: 0, resize: 'none' }} 
                    value={state.content} 
                    onChange={e => setState({ ...state, content: e.target.value })} 
                    required 
                />
            </div>

            {/* Split row for Priority and Date (Picker placeholder) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Priority</label>
                    <select 
                        style={{ ...inputStyle, marginBottom: 0 }} 
                        value={state.priority} 
                        onChange={e => setState({ ...state, priority: e.target.value })}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Date and Time</label>
                    <input 
                        type="datetime-local" 
                        style={{ ...inputStyle, marginBottom: 0 }} 
                        value={state.schedule}
                        onChange={e => setState({ ...state, schedule: e.target.value })}
                    />
                </div>
            </div>

            {/* Attachment Placeholder */}
            <div style={{ 
                padding: '16px', 
                border: '2px dashed #E2E8F0', 
                borderRadius: '12px', 
                textAlign: 'center',
                cursor: 'pointer',
                background: '#F8F9FC'
            }}>
                <ImageIcon size={24} color="#94A3B8" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748B' }}>Attachment upload option (image/pdf)</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                <button 
                    type="button" 
                    onClick={() => onComplete({ preventDefault: () => {}, target: { value: 'cancel' } })} // Mock cancel
                    style={{ ...btnStyle, background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>
                    Cancel
                </button>
                <button 
                    type="submit" 
                    style={{ ...btnStyle, background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)' }}>
                    Save Care Note
                </button>
            </div>
        </div>
    </form>
);
const AlertsSection = ({ summary }) => {
    const alerts = summary?.recentAlerts || [];

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>Recent Alerts</h3>
            {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>No recent alerts found.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {alerts.map((alert, index) => (
                        <div key={index} style={{
                            background: alert.severity === 'Critical' ? '#FEF2F2' : '#FFF',
                            padding: '20px',
                            borderRadius: '16px',
                            border: `1px solid ${alert.severity === 'Critical' ? '#FECACA' : '#E2E8F0'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{
                                    fontWeight: 'bold',
                                    color: alert.severity === 'Critical' ? '#DC2626' : '#1E293B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {alert.severity === 'Critical' && <AlertTriangle size={18} />}
                                    {alert.title}
                                </div>
                                <div style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>{alert.message}</div>
                                <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '8px' }}>
                                    {new Date(alert.createdAt).toLocaleString()}
                                </div>
                            </div>
                            {alert.location && (
                                <a
                                    href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: '#1E3A8A',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <MapPin size={16} /> View Location
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AddMedForm = ({ onComplete, state, setState }) => (
    <form onSubmit={onComplete}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Medication Name</label>
            <input placeholder="e.g. Paracetamol" style={{ ...inputStyle, marginBottom: 0 }} value={state.name} onChange={e => setState({ ...state, name: e.target.value })} required />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Dosage</label>
                <input placeholder="e.g. 500mg" style={{ ...inputStyle, marginBottom: 0 }} value={state.dosage} onChange={e => setState({ ...state, dosage: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Frequency</label>
                <select style={{ ...inputStyle, marginBottom: 0 }} value={state.frequency} onChange={e => setState({ ...state, frequency: e.target.value })}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As Needed">As Needed</option>
                </select>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Time</label>
                <input type="time" style={{ ...inputStyle, marginBottom: 0 }} value={state.timings} onChange={e => setState({ ...state, timings: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Refill At</label>
                <input type="number" placeholder="Alert at X doses" style={{ ...inputStyle, marginBottom: 0 }} value={state.refillThreshold} onChange={e => setState({ ...state, refillThreshold: parseInt(e.target.value) || 0 })} />
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Stock Level</label>
            <input type="number" placeholder="Initial Pills/Doses" min="0" style={{ ...inputStyle, marginBottom: 0 }} value={state.stock} onChange={e => setState({ ...state, stock: parseInt(e.target.value) || 0 })} required />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Specific Instructions</label>
            <textarea placeholder="e.g. After meals" style={{ ...inputStyle, marginBottom: 0, minHeight: '60px' }} value={state.instructions} onChange={e => setState({ ...state, instructions: e.target.value })} />
        </div>

        <button type="submit" style={btnStyle}>Save Medication</button>
    </form>
);

const AddAppointmentForm = ({ onComplete, state, setState }) => (
    <form onSubmit={onComplete}>
        <input placeholder="Title" style={inputStyle} value={state.title} onChange={e => setState({ ...state, title: e.target.value })} />
        <input type="datetime-local" style={inputStyle} value={state.date} onChange={e => setState({ ...state, date: e.target.value })} />
        <input placeholder="Location" style={inputStyle} value={state.location} onChange={e => setState({ ...state, location: e.target.value })} />
        <select style={inputStyle} value={state.type} onChange={e => setState({ ...state, type: e.target.value })}>
            <option>Doctor</option><option>Therapy</option><option>Lab Test</option>
        </select>
        <button type="submit" style={btnStyle}>Schedule</button>
    </form>
);

const AddRoutineForm = ({ onComplete, state, setState }) => (
    <form onSubmit={onComplete}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Routine Title</label>
            <input placeholder="e.g. Morning Exercise" style={{ ...inputStyle, marginBottom: 0 }} value={state.title} onChange={e => setState({ ...state, title: e.target.value })} required />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Description</label>
            <textarea placeholder="Describe the routine task..." style={{ ...inputStyle, marginBottom: 0, minHeight: '60px' }} value={state.description} onChange={e => setState({ ...state, description: e.target.value })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Date</label>
                <input type="date" style={{ ...inputStyle, marginBottom: 0 }} value={state.date} onChange={e => setState({ ...state, date: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Time</label>
                <input type="time" style={{ ...inputStyle, marginBottom: 0 }} value={state.time} onChange={e => setState({ ...state, time: e.target.value })} required />
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748B' }}>Repeat Type</label>
            <select style={{ ...inputStyle, marginBottom: 0 }} value={state.repeatType} onChange={e => setState({ ...state, repeatType: e.target.value })}>
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
            </select>
        </div>

        <button type="submit" style={btnStyle}>Add Routine</button>
    </form>
);

const AddMemoryForm = ({ onComplete, state, setState }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setState({ ...state, contentUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={onComplete}>
            <input placeholder="Title" style={inputStyle} value={state.title} onChange={e => setState({ ...state, title: e.target.value })} required />
            
            <div style={{...inputStyle, background: '#F8F9FC', position: 'relative', overflow: 'hidden', padding: '20px', textAlign: 'center', cursor: 'pointer', border: '2px dashed #CBD5E1' }}>
                <input type="file" accept="image/*, video/*" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer', height: '100%' }} />
                {!state.contentUrl ? (
                    <div style={{ color: '#64748B' }}><ImageIcon size={32} style={{marginBottom: '10px'}}/><br/>Click or drag to upload photo</div>
                ) : (
                    state.contentUrl.startsWith('data:video') ? 
                        <video src={state.contentUrl} controls style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px' }} /> :
                        <img src={state.contentUrl} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px' }} />
                )}
            </div>

            <textarea placeholder="Caption" style={{ ...inputStyle, minHeight: '80px' }} value={state.caption} onChange={e => setState({ ...state, caption: e.target.value })} />
            <button type="submit" style={{...btnStyle, opacity: (!state.contentUrl || !state.title) ? 0.5 : 1}} disabled={!state.contentUrl || !state.title}>Upload Memory</button>
        </form>
    );
};

const FamilySettingsView = ({ user, showMessage }) => {
    return (
        <div style={{ maxWidth: '900px', animation: 'fadeIn 0.4s ease-out' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>Account Settings</h2>
            <p style={{ color: '#64748B', marginBottom: '32px' }}>Manage your care profile and notification preferences.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                
                {/* Profile Card */}
                <div style={DashboardBoxStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ width: '50px', height: '50px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                            <User size={24} />
                        </div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Your Profile</h4>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={LabelStyle}>FULL NAME</label>
                            <input style={CleanInputStyle} defaultValue={user?.name || 'Caregiver'} />
                        </div>
                        <div>
                            <label style={LabelStyle}>EMAIL ADDRESS</label>
                            <input style={CleanInputStyle} defaultValue={user?.email || ''} disabled />
                        </div>
                        <div>
                            <label style={LabelStyle}>PHONE NUMBER</label>
                            <input style={CleanInputStyle} placeholder="+1 (555) 000-0000" />
                        </div>
                        <button 
                            onClick={() => showMessage('success', 'Profile updated successfully')}
                            style={{ ...btnStyle, marginTop: '10px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}>
                            Save Profile Changes
                        </button>
                    </div>
                </div>

                {/* Preferences Card */}
                <div style={DashboardBoxStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ width: '50px', height: '50px', background: '#ECFDF5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                            <Bell size={24} />
                        </div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Notification Center</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <FamilyToggle label="Email Alerts" description="Get weekly health reports via email." active={true} />
                        <div style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9', opacity: 0.6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>Push Notifications</div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>Browser support required</div>
                                </div>
                                <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700' }}>MOBILE ONLY</div>
                            </div>
                        </div>
                        <FamilyToggle label="SOS SMS Alerts" description="Immediate text when SOS is triggered." active={true} />
                        <FamilyToggle label="Medication Reminders" description="Notify me if a dose is missed." active={true} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

const FamilyToggle = ({ label, description, active }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>{label}</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{description}</div>
        </div>
        <div style={{
            width: '40px', height: '20px', borderRadius: '10px', background: active ? '#10B981' : '#E2E8F0',
            position: 'relative', cursor: 'pointer'
        }}>
            <div style={{ position: 'absolute', top: '2px', left: active ? '22px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }} />
        </div>
    </div>
);

const DashboardBoxStyle = { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' };
const LabelStyle = { fontSize: '11px', fontWeight: '800', color: '#94A3B8', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' };
const CleanInputStyle = { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8F9FC', fontSize: '14px', outline: 'none' };

export default FamilyDashboard;
