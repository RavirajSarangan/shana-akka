import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Heart, Users, Activity, Bell, Camera, Clock, Calendar, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import familyBg from '../assets/family-login-bg.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!email.trim() || !password.trim()) {
            setError('Email and password are required');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'Family Member') {
                navigate('/');
            } else if (user.role === 'Elder') {
                setError(
                    <span>You are an Elder. Please use the <a href="http://localhost:5173" style={{ color: '#1E3A8A', fontWeight: 700 }}>Elder Portal</a>.</span>
                );
            } else if (user.role === 'Admin') {
                setError(
                    <span>You are an Admin. Please use the <a href="http://localhost:5174/login" style={{ color: '#1E3A8A', fontWeight: 700 }}>Admin Panel</a>.</span>
                );
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '16px 16px 16px 48px', fontSize: '16px',
        background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '14px',
        color: '#1E293B', outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
    const focusIn = e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 4px rgba(30, 58, 138, 0.1)'; };
    const focusOut = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>

            {/* ── LEFT SIDE: BRANDING & FEATURES (45%) ─────────────────── */}
            <div style={{
                flex: '0 0 45%', position: 'relative', overflow: 'hidden',
                background: `url(${familyBg}) center/cover no-repeat`,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px'
            }} className="login-panel-left">
                {/* Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.85) 100%)',
                    zIndex: 1
                }} />

                <div style={{ position: 'relative', zIndex: 2, color: 'white' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255, 255, 255, 0.2)', padding: '8px 20px',
                        borderRadius: '999px', fontSize: '13px', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px',
                        backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <Users size={14} /> Family Caregiver Portal
                    </div>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                        <div style={{
                            width: '44px', height: '44px', background: 'white',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Heart size={26} color="#1E3A8A" fill="#1E3A8A" />
                        </div>
                        <span style={{ fontSize: '28px', fontWeight: '900', fontFamily: "'Outfit', sans-serif" }}>ElderEase</span>
                    </div>

                    <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>
                        Stay Connected With <br />Your Loved Ones
                    </h1>
                    <p style={{ fontSize: '18px', opacity: 0.95, lineHeight: 1.6, marginBottom: '48px', maxWidth: '440px' }}>
                        Monitor health updates, track medication adherence, and receive important alerts from one unified caregiver dashboard.
                    </p>

                    {/* Feature Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {[
                            { icon: <Activity size={20} />, text: 'Real-time health monitoring' },
                            { icon: <Clock size={20} />, text: 'Medication adherence tracking' },
                            { icon: <Bell size={20} />, text: 'Emergency SOS notifications' },
                            { icon: <Camera size={20} />, text: 'Shared family memory wall' },
                            { icon: <Users size={20} />, text: 'Daily activity updates' },
                            { icon: <Calendar size={20} />, text: 'Doctor appointment tracking' },
                        ].map((f, i) => (
                            <div key={i} style={{
                                background: 'rgba(255, 255, 255, 0.12)', padding: '20px',
                                borderRadius: '16px', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)', transition: 'all 0.3s'
                            }} className="feature-card">
                                <div style={{ marginBottom: '12px', color: 'white' }}>{f.icon}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{f.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT SIDE: LOGIN FORM (55%) ────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1E293B', marginBottom: '12px', fontFamily: "'Outfit', sans-serif" }}>Sign In</h2>
                        <p style={{ fontSize: '16px', color: '#64748B' }}>Access your family caregiver dashboard</p>
                    </div>

                    {error && (
                        <div 
                            role="alert"
                            aria-live="assertive"
                            style={{
                                background: '#FFF1F2', color: '#E11D48', border: '1px solid #FDA4AF',
                                borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
                                fontSize: '15px', display: 'flex', gap: '12px', alignItems: 'center'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>⚠️</span><span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Email Address */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email" placeholder="Enter your email"
                                    value={email} 
                                    onChange={e => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }} 
                                    required
                                    style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                                    value={password} 
                                    onChange={e => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }} 
                                    required
                                    style={{ ...inputStyle, paddingRight: '50px' }} onFocus={focusIn} onBlur={focusOut}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#64748B', fontSize: '15px' }}>
                                <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1E3A8A' }} />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={{ color: '#1E3A8A', fontWeight: '800', fontSize: '15px', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>

                        {/* Login Button */}
                        <button type="submit" disabled={isLoading}
                            style={{
                                width: '100%', padding: '18px', fontSize: '18px', fontWeight: '700',
                                background: isLoading ? '#94A3B8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                                color: 'white', border: 'none', borderRadius: '16px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                boxShadow: isLoading ? 'none' : '0 10px 25px rgba(30, 58, 138, 0.25)',
                                marginTop: '10px', transition: 'all 0.3s ease'
                            }} className="login-btn">
                             {isLoading ? <><span className="loader" /> Signing in...</> : <><LogIn size={22} /> Sign In</>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '32px', color: '#64748B', fontSize: '16px' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#1E3A8A', fontWeight: '800', textDecoration: 'none' }}>Register here</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .loader { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
                .feature-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.18); }
                .login-btn:hover { transform: translateY(-2px); boxShadow: 0 12px 30px rgba(30, 58, 138, 0.35); }
                
                @media (max-width: 1024px) {
                    .login-panel-left { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Login;
