import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAdminAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--background)',
            padding: '20px'
        }}>
            <div className="admin-card" style={{ padding: '48px', width: '100%', maxWidth: '440px', background: 'white' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '12px',
                        margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)'
                    }}>
                        <ShieldAlert color="#FFF" size={28} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)' }}>Admin Portal</h2>
                    <p style={{ color: 'var(--muted-foreground)', marginTop: '8px', fontSize: '15px' }}>Secure access to platform management</p>
                </div>

                {error && (
                    <div style={{
                        color: 'var(--emergency)',
                        background: '#FEF2F2',
                        border: '1px solid #FEE2E2',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--muted-foreground)' }} size={18} />
                            <input
                                type="email"
                                placeholder="admin@elderease.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px',
                                    border: '1px solid var(--border)', outline: 'none',
                                    fontSize: '15px', transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--muted-foreground)' }} size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 42px 12px 42px', borderRadius: '8px',
                                    border: '1px solid var(--border)', outline: 'none',
                                    fontSize: '15px', transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--muted-foreground)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: 'var(--primary)', color: '#FFF', border: 'none', padding: '14px',
                            borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '10px',
                            fontSize: '16px', transition: 'transform 0.1s, filter 0.2s',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
                        onMouseOut={(e) => e.target.style.filter = 'brightness(1.0)'}
                        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.target.style.transform = 'scale(1.0)'}
                    >
                        {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                        Institutional Access Only. <br />
                        Contact IT Support if you lost your keys.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
