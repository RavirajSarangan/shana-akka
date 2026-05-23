import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle, XCircle, ChevronLeft, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Medications = () => {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeds = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/medications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMeds(res.data);
            } catch (err) {
                console.error("Error fetching meds", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMeds();
    }, []);

    const handleLogMed = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/medications/${id}/log`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh list
            const res = await axios.get('/api/medications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMeds(res.data);
        } catch (err) {
            console.error("Error logging med", err);
            alert("Failed to log medication. Please try again.");
        }
    };

    const handleDeleteMed = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/medications/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMeds(meds.filter(m => m._id !== id));
                alert('Medication entry was deleted successfully.');
            } catch (err) {
                console.error("Error deleting med", err);
                alert("Failed to delete medication. Please try again.");
            }
        }
    };

    return (
        <div className="elder-mode medications-page" style={{ minHeight: '100vh', background: 'var(--secondary-color)', padding: '30px 20px' }}>
            <header style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/elder" className="big-button" style={{ padding: '15px 25px', height: 'auto', width: 'auto' }}>
                    <ChevronLeft size={32} /> Back
                </Link>
                <h1 style={{ fontSize: '48px', color: '#1E3A8A', fontWeight: '900' }}>My Medications</h1>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', fontSize: '32px', marginTop: '100px' }}>Loading your medicines...</div>
            ) : (
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {meds.length === 0 ? (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                            <Info size={64} color="#1E3A8A" style={{ marginBottom: '20px' }} />
                            <p style={{ fontSize: '28px' }}>No medications listed for today.</p>
                        </div>
                    ) : (
                        meds.map((med) => (
                            <div key={med._id} className="glass-card med-item" style={{
                                padding: '30px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: `15px solid ${med.active ? '#1E3A8A' : '#94A3B8'}`
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                        <Pill size={40} color="#1E3A8A" />
                                        <h2 style={{ fontSize: '36px', margin: 0, color: '#1E3A8A' }}>{med.name}</h2>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '24px', color: 'var(--text-light)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Clock size={24} /> {med.timings?.join(', ')}
                                        </span>
                                        <span><strong>Dosage:</strong> {med.dosage}</span>
                                    </div>
                                    {med.instructions && (
                                        <p style={{ fontSize: '20px', marginTop: '10px', fontStyle: 'italic' }}>
                                            Note: {med.instructions}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <button
                                        onClick={() => handleLogMed(med._id, 'Taken')}
                                        className="big-button"
                                        style={{
                                            background: '#2ECC71',
                                            color: 'white',
                                            borderColor: '#2ECC71',
                                            width: '180px',
                                            padding: '20px'
                                        }}
                                    >
                                        <CheckCircle size={32} />
                                        <span>Taken</span>
                                    </button>
                                    <button
                                        onClick={() => handleLogMed(med._id, 'Missed')}
                                        className="big-button"
                                        style={{
                                            background: 'white',
                                            color: '#1E3A8A',
                                            borderColor: '#1E3A8A',
                                            width: '180px',
                                            padding: '20px'
                                        }}
                                    >
                                        <XCircle size={32} />
                                        <span>Missed</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMed(med._id)}
                                        className="big-button"
                                        style={{
                                            background: '#E74C3C',
                                            color: 'white',
                                            borderColor: '#E74C3C',
                                            width: '180px',
                                            padding: '20px'
                                        }}
                                    >
                                        <XCircle size={32} />
                                        <span>Delete</span>
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

export default Medications;
