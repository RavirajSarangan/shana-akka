import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, Plus, Clock, Info, XCircle } from 'lucide-react';
import axios from 'axios';

const Routine = ({ elderId, elderName, onAdd, authHeaders, refreshTrigger }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                if (!elderId) {
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`/api/routines/${elderId}`, authHeaders);
                setTasks(res.data);
            } catch (err) {
                console.error("Error fetching routines", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutines();
    }, [elderId, authHeaders, refreshTrigger]);

    const handleCompleteTask = async (id) => {
        try {
            await axios.put(`/api/routines/${id}/complete`, {}, authHeaders);
            // Refresh list
            const res = await axios.get(`/api/routines/${elderId}`, authHeaders);
            setTasks(res.data);
        } catch (err) {
            console.error("Error completing routine", err);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this routine?')) {
            try {
                await axios.delete(`/api/routines/${id}`, authHeaders);
                setTasks(tasks.filter(t => t._id !== id));
            } catch (err) {
                console.error("Error deleting routine", err);
            }
        }
    };

    return (
        <div style={{ minHeight: '100%', background: '#F8F9FC', padding: '30px 0' }}>
            {/* Header with Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                        {elderName ? `${elderName}'s Routine` : 'Daily Routines'}
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '16px' }}>
                        Manage and track daily activities and tasks.
                    </p>
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
                    <Plus size={20} /> Add Routine
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', fontSize: '18px', marginTop: '40px', color: '#64748B' }}>Loading routines...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
                    {tasks.length === 0 ? (
                        <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                            <Info size={48} color="#94A3B8" style={{ marginBottom: '20px' }} />
                            <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '20px' }}>No routine tasks set yet.</p>
                            <button onClick={onAdd} style={{
                                padding: '10px 20px',
                                background: '#1E3A8A',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Plus size={18} /> Add the first routine
                            </button>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task._id}
                                style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    transition: 'all 0.2s',
                                    opacity: task.completed ? 0.7 : 1,
                                    borderLeft: `5px solid ${task.completed ? '#10B981' : '#1E3A8A'}`
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            margin: 0,
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            color: task.completed ? '#95A5A6' : '#0F172A'
                                        }}>
                                            {task.title}
                                        </h3>
                                        {task.repeatType && (
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: '#E0E7FF',
                                                color: '#1E3A8A',
                                                padding: '4px 10px',
                                                borderRadius: '6px'
                                            }}>
                                                {task.repeatType}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748B' }}>
                                        {task.time && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={16} /> {task.time}
                                            </span>
                                        )}
                                        {task.date && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Calendar size={16} /> {new Date(task.date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    {task.description && (
                                        <p style={{ fontSize: '14px', marginTop: '8px', color: '#64748B' }}>{task.description}</p>
                                    )}
                                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#94A3B8' }}>
                                        Status: <strong>{task.status || 'pending'}</strong>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        style={{
                                            background: '#FEE2E2',
                                            color: '#EF4444',
                                            border: '1px solid #FECACA',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <XCircle size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Routine;
