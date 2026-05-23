import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/reset-password', { email, newPassword, role: 'Family Member' });
            setMessage(res.data.message);
            setTimeout(() => { navigate('/login'); }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password. Please try again.');
        } finally { setIsLoading(false); }
    };

    const inputStyle = { width: '100%', padding: '13px 16px', fontSize: '15px', border: '1.5px solid #E2E8F0', borderRadius: '11px', background: '#F8FAFC', outline: 'none', transition: 'all 0.2s', color: '#1E293B', fontFamily: 'inherit' };
    const focusIn  = e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.15)'; };
    const focusOut = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)', padding: '40px 20px' }}>
            <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '22px', boxShadow: '0 20px 50px rgba(0,0,0,0.10)', padding: '48px 40px', border: '1px solid #E0E7FF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={21} fill="white" color="white" />
                    </div>
                    <span style={{ fontSize: '21px', fontWeight: '800', color: '#1E3A8A', fontFamily: "'Outfit', sans-serif" }}>ElderEase</span>
                </div>

                <div style={{ width: '68px', height: '68px', background: '#E0E7FF', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                    <KeyRound size={34} color="#1E3A8A" />
                </div>

                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", marginBottom: '8px' }}>Reset Password</h1>
                <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '28px' }}>Enter your email and choose a new secure password</p>

                {message && (
                    <div style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: '11px', padding: '12px 15px', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <CheckCircle size={18} /><span>{message} Redirecting…</span>
                    </div>
                )}
                {error && (
                    <div style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: '11px', padding: '12px 15px', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span>⚠️</span><span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '7px' }}>Email Address</label>
                        <input type="email" placeholder="family@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '7px' }}>New Password</label>
                        <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} required onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <button type="submit" disabled={isLoading || !!message}
                        style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '700', background: (isLoading || message) ? '#94A3B8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)', color: 'white', border: 'none', borderRadius: '11px', cursor: (isLoading || message) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', boxShadow: (isLoading || message) ? 'none' : '0 4px 14px rgba(30,58,138,0.35)', marginTop: '4px', transition: 'all 0.2s' }}>
                        {isLoading ? (<><span style={{ width: '17px', height: '17px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Resetting…</>) : (<><KeyRound size={17} /> Reset Password</>)}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1E3A8A', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
    );
};

export default ForgotPassword;
