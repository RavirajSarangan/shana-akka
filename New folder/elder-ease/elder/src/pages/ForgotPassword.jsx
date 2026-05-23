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
        setMessage('');
        setError('');
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/reset-password', {
                email,
                newPassword,
                role: 'Elder'
            });
            setMessage(res.data.message);
            setTimeout(() => { navigate('/login'); }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '14px 18px', fontSize: '16px',
        border: '2px solid #E5E7EB', borderRadius: '12px',
        background: '#F9FAFB', outline: 'none',
        transition: 'all 0.2s', color: '#1F2937', fontFamily: 'inherit'
    };
    const focusIn = e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.15)'; };
    const focusOut = e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
            padding: '40px 20px',
        }}>
            <div style={{
                width: '100%', maxWidth: '460px',
                background: '#fff', borderRadius: '24px',
                boxShadow: '0 20px 48px rgba(0,0,0,0.10)', padding: '52px 44px',
                border: '1px solid #F1F5F9'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
                    <div style={{
                        width: '42px', height: '42px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                        borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Heart size={22} fill="white" color="white" />
                    </div>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#1E3A8A', fontFamily: "'Outfit', sans-serif" }}>ElderEase</span>
                </div>

                {/* Icon & Heading */}
                <div style={{
                    width: '72px', height: '72px', background: '#E0E7FF',
                    borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <KeyRound size={36} color="#1E3A8A" />
                </div>

                <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", marginBottom: '8px' }}>
                    Reset Password
                </h1>
                <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px' }}>
                    Enter your email and choose a new secure password
                </p>

                {/* Success message */}
                {message && (
                    <div style={{
                        background: '#E0E7FF', color: '#1E3A8A', border: '1px solid #C7D2FE',
                        borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
                        fontSize: '15px', display: 'flex', gap: '10px', alignItems: 'center'
                    }}>
                        <CheckCircle size={20} />
                        <span>{message} Redirecting to login…</span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA',
                        borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
                        fontSize: '15px', display: 'flex', gap: '10px', alignItems: 'flex-start'
                    }}>
                        <span>⚠️</span><span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Email Address</label>
                        <input
                            type="email" placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={inputStyle} required
                            onFocus={focusIn} onBlur={focusOut}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>New Password</label>
                        <input
                            type="password" placeholder="••••••••"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={inputStyle} required
                            onFocus={focusIn} onBlur={focusOut}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !!message}
                        style={{
                            width: '100%', padding: '15px', fontSize: '16px', fontWeight: '700',
                            background: (isLoading || message) ? '#CBD5E1' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                            color: 'white', border: 'none', borderRadius: '12px',
                            cursor: (isLoading || message) ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            boxShadow: (isLoading || message) ? 'none' : '0 4px 14px rgba(30,58,138,0.35)',
                            transition: 'all 0.2s', marginTop: '4px',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{ width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                Resetting…
                            </>
                        ) : (
                            <><KeyRound size={18} /> Reset Password</>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '28px', textAlign: 'center' }}>
                    <Link to="/login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        color: '#1E3A8A', fontWeight: '600', fontSize: '15px', textDecoration: 'none',
                    }}>
                        <ArrowLeft size={17} /> Back to Login
                    </Link>
                </div>
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
    );
};

export default ForgotPassword;
