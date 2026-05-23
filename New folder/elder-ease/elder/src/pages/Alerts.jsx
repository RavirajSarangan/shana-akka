import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft, Info, AlertTriangle, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchData = async () => {
        try {
            const [alertsRes, requestsRes] = await Promise.all([
                axios.get('/api/alerts', getAuthHeaders()),
                axios.get('/api/family/pending-requests', getAuthHeaders())
            ]);
            setAlerts(alertsRes.data);
            setRequests(requestsRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/alerts/${id}/read`, {}, getAuthHeaders());
            setAlerts(alerts.map(a => a._id === id ? { ...a, read: true } : a));
        } catch (err) {
            console.error("Error marking alert as read", err);
        }
    };

    const handleRequest = async (id, status) => {
        try {
            console.log(`Responding to request ${id} with status ${status}`);
            const res = await axios.put(`/api/family/respond-link/${id}`, { status }, getAuthHeaders());
            console.log("Response:", res.data);

            // Remove the request from local state
            setRequests(prev => prev.filter(r => r._id !== id));

            alert(`Link request successfully ${status === 'Approved' ? 'approved' : 'declined'}.`);

            // Optionally refresh alerts as well since responding might create a system alert
            fetchData();
        } catch (err) {
            console.error("Error responding to request", err);
            const msg = err.response?.data?.msg || "Failed to respond. Please try again.";
            alert(msg);
        }
    };

    return (
        <div className="elder-mode alerts-page" style={{ minHeight: '100vh', background: 'var(--secondary-color)', padding: '30px 20px' }}>
            <header style={{ 
                marginBottom: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '24px',
                background: 'rgba(255,255,255,0.8)',
                padding: '24px',
                borderRadius: '24px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
                <Link to="/dashboard" className="big-button" style={{ 
                    padding: '12px 24px', 
                    height: 'auto', 
                    width: 'auto', 
                    flexDirection: 'row', 
                    gap: '10px',
                    background: 'white',
                    color: '#1E3A8A',
                    border: '1px solid #E2E8F0',
                    fontSize: '20px',
                    fontWeight: '700'
                }}>
                    <ChevronLeft size={28} /> Back
                </Link>
                <h1 style={{ fontSize: '36px', margin: 0, fontWeight: '900', color: '#1E3A8A' }}>Notices & Requests</h1>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', fontSize: '32px', marginTop: '50px' }}>Checking for updates...</div>
            ) : (
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Family Link Requests Section */}
                    {requests.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h2 style={{ fontSize: '36px', color: 'var(--primary-color)', borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px' }}>Family Connection Requests</h2>
                            {requests.map((req) => (
                                <div key={req._id} className="glass-card" style={{
                                    padding: '40px',
                                    borderLeft: '15px solid var(--primary-color)',
                                    background: '#FFF'
                                }}>
                                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div style={{ background: 'var(--secondary-color)', padding: '20px', borderRadius: '50%' }}>
                                            <Info size={60} color="var(--primary-color)" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: '300px' }}>
                                            <h3 style={{ fontSize: '36px', marginBottom: '10px' }}>{req.familyId?.name || 'A family member'} wants to link accounts</h3>
                                            <p style={{ fontSize: '24px', color: '#666' }}>They want to help manage your health and routines.</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <button
                                                onClick={() => handleRequest(req._id, 'Approved')}
                                                className="big-button"
                                                style={{ background: '#1E3A8A', color: 'white', border: 'none', padding: '20px 40px', fontSize: '28px', minWidth: '150px', borderRadius: '18px' }}>
                                                <Check size={32} style={{ marginBottom: '5px' }} />
                                                Allow
                                            </button>
                                            <button
                                                onClick={() => handleRequest(req._id, 'Revoked')}
                                                className="big-button"
                                                style={{ background: 'white', color: '#64748B', border: '2px solid #E2E8F0', padding: '20px 40px', fontSize: '28px', minWidth: '150px', borderRadius: '18px' }}>
                                                <X size={32} style={{ marginBottom: '5px' }} />
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* General Alerts Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontSize: '36px', color: 'var(--text-light)', borderBottom: '2px solid #EEE', paddingBottom: '10px' }}>History & Notifications</h2>
                        {alerts.length === 0 && requests.length === 0 ? (
                            <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
                                <Bell size={80} color="var(--primary-color)" style={{ marginBottom: '20px', opacity: 0.3 }} />
                                <p style={{ fontSize: '32px', color: '#999' }}>Everything looks good today!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {alerts.map((alert) => (
                                    <div key={alert._id} className="glass-card" style={{
                                        padding: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '25px',
                                        opacity: alert.read ? 0.6 : 1,
                                        borderLeft: `15px solid ${alert.severity === 'Critical' ? '#E74C3C' : '#F1C40F'}`
                                    }}>
                                        {alert.severity === 'Critical' ? <AlertTriangle size={64} color="#E74C3C" /> : <Bell size={64} color="#F1C40F" />}
                                        <div style={{ flex: 1 }}>
                                            <h2 style={{ fontSize: '32px', margin: 0 }}>{alert.title}</h2>
                                            <p style={{ fontSize: '24px', margin: '5px 0' }}>{alert.message}</p>
                                            <span style={{ fontSize: '18px', color: '#888' }}>{new Date(alert.createdAt).toLocaleString()}</span>
                                        </div>
                                        {!alert.read && (
                                            <button
                                                onClick={() => markAsRead(alert._id)}
                                                className="big-button"
                                                style={{ height: 'auto', padding: '20px 30px', fontSize: '24px', background: 'var(--primary-color)', color: 'white', border: 'none' }}>
                                                OK
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alerts;
