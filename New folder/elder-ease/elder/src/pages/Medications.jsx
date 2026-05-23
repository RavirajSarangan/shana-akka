import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle, XCircle, ChevronLeft, Clock, AlertTriangle, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Medications = () => {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchMeds = async () => {
        try {
            const res = await axios.get('/api/medications', getAuthHeaders());
            setMeds(res.data);
        } catch (err) {
            console.error("Error fetching meds", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMeds(); }, []);

    const handleLogMed = async (id, status, medName) => {
        try {
            const res = await axios.put(`/api/medications/${id}/log`, { status }, getAuthHeaders());

            if (res.status === 200 || res.status === 201) {
                const voiceResponse = status === 'Taken'
                    ? `Great job! You have taken your ${medName}.`
                    : `I've noted that you missed your ${medName}. I will let your family know to check in.`;

                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(voiceResponse);
                    utterance.rate = 0.9;
                    window.speechSynthesis.speak(utterance);
                }
                await fetchMeds();
            }
        } catch (err) {
            console.error("Error logging med", err);
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
                height: '80px', display: 'flex', alignItems: 'center', gap: '20px',
                position: 'sticky', top: 0, zIndex: 50
            }}>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(30,58,138,0.2)' }}>
                        <Pill size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1E3A8A', margin: 0 }}>My Medications</h1>
                        <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>{meds.filter(m => m.active).length} medicines today</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div style={{ width: '52px', height: '52px', border: '5px solid #E0E7FF', borderTopColor: '#1E3A8A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                        <p style={{ fontSize: '24px', color: '#64748B' }}>Loading your medications...</p>
                    </div>
                ) : meds.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '32px', padding: '80px 40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '100px', height: '100px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                            <Pill size={48} color="#1E3A8A" opacity={0.3} />
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A', marginBottom: '16px' }}>No medications set</h2>
                        <p style={{ fontSize: '20px', color: '#94A3B8' }}>Your family will add your medicine schedule soon.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {meds.map((med) => {
                            const today = new Date().toDateString();
                            const takenToday = med.logs && med.logs.some(log =>
                                log.status === 'Taken' && new Date(log.date).toDateString() === today
                            );
                            const lowStock = med.stock <= med.refillThreshold;

                            return (
                                <div key={med._id} style={{
                                    background: 'white', borderRadius: '28px',
                                    padding: '32px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '32px',
                                    border: `2px solid ${takenToday ? '#E0E7FF' : '#F1F5F9'}`,
                                    boxShadow: takenToday ? 'none' : '0 10px 25px rgba(0,0,0,0.04)',
                                    opacity: takenToday ? 0.8 : 1,
                                    transition: 'all 0.3s'
                                }}>
                                    {/* Info Section */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                            <div style={{ 
                                                width: '64px', height: '64px',
                                                background: takenToday ? '#E0E7FF' : '#FEF2F2',
                                                borderRadius: '18px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Pill size={32} color={takenToday ? '#1E3A8A' : '#DC2626'} />
                                            </div>
                                            <div>
                                                <h2 style={{
                                                    fontSize: '32px', fontWeight: '900', color: '#0F172A',
                                                    margin: 0,
                                                    textDecoration: takenToday ? 'line-through' : 'none',
                                                    opacity: takenToday ? 0.6 : 1
                                                }}>{med.name}</h2>
                                                {takenToday ? (
                                                    <span style={{ fontSize: '15px', color: '#1E3A8A', fontWeight: '800' }}>✓ TASK COMPLETED</span>
                                                ) : (
                                                    <div style={{ background: '#F3F4F6', padding: '4px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                        <Clock size={14} /> Scheduled: {med.timings?.join(', ') || 'As needed'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <span style={{ fontSize: '20px', color: '#374151', fontWeight: '700' }}>
                                                Dose: {med.dosage}
                                            </span>
                                            <span style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                padding: '6px 14px', borderRadius: '999px', fontSize: '15px', fontWeight: '800',
                                                background: lowStock ? '#FEF2F2' : '#F0FDF4',
                                                color: lowStock ? '#DC2626' : '#16A34A',
                                                border: `1.5px solid ${lowStock ? '#FECACA' : '#BBF7D0'}`
                                            }}>
                                                {lowStock && <AlertTriangle size={15} />}
                                                {med.stock} tablets left
                                            </span>
                                        </div>

                                        {med.instructions && (
                                            <p style={{ fontSize: '18px', marginTop: '16px', color: '#6B7280', padding: '12px 20px', background: '#F8FAFC', borderRadius: '14px', fontStyle: 'italic', borderLeft: '4px solid #CBD5E1' }}>
                                                "{med.instructions}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ minWidth: '180px' }}>
                                        {takenToday ? (
                                            <div style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                                padding: '24px', background: '#E0E7FF', borderRadius: '24px',
                                                color: '#1E3A8A', fontWeight: '900', fontSize: '20px'
                                            }}>
                                                <CheckCircle size={48} />
                                                Taken
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <button
                                                    onClick={() => handleLogMed(med._id, 'Taken', med.name)}
                                                    style={{
                                                        padding: '20px 32px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                                                        color: 'white', border: 'none', borderRadius: '18px',
                                                        cursor: 'pointer', fontSize: '20px', fontWeight: '900',
                                                        boxShadow: '0 8px 16px rgba(30,58,138,0.3)', transition: 'all 0.2s',
                                                        display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    <CheckCircle size={28} /> I've Taken It
                                                </button>
                                                <button
                                                    onClick={() => handleLogMed(med._id, 'Missed', med.name)}
                                                    style={{
                                                        padding: '14px', background: 'white',
                                                        color: '#94A3B8', border: '2px solid #E2E8F0', borderRadius: '18px',
                                                        cursor: 'pointer', fontSize: '16px', fontWeight: '800',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#DC2626'}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                                                >
                                                    Mark as Missed
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
    );
};

export default Medications;
