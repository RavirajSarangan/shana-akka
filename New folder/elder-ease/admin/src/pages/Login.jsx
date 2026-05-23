import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, BarChart3, Users, Bell, Settings, Database, Activity, ShieldCheck, FileSearch } from 'lucide-react';
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
        
        // Client-side validation
        if (!email.trim() || !password.trim()) {
            setError('Email and password are required');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '16px 16px 16px 48px', fontSize: '15px',
        background: '#FFFFFF', border: '2px solid #E2E8F0', borderRadius: '14px',
        color: '#0F172A', outline: 'none', transition: 'all 0.3s ease'
    };
    const focusIn = e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 4px rgba(30, 58, 138, 0.1)'; };
    const focusOut = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>

            {/* ── LEFT SIDE: ADMIN CONSOLE INFO (45%) ──────────────────── */}
            <div style={{
                flex: '0 0 45%', position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px'
            }} className="login-panel-left">
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 2, color: 'white' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', padding: '8px 20px',
                        borderRadius: '999px', fontSize: '12px', fontWeight: '800',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                        <ShieldCheck size={14} /> Secure Admin Console
                    </div>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
                        <div style={{
                            width: '46px', height: '46px', background: 'white',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        }}>
                            <ShieldAlert size={26} color="#1E3A8A" />
                        </div>
                        <div>
                            <div style={{ fontSize: '26px', fontWeight: '900', fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>ElderEase</div>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Console</div>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px', lineHeight: 1.1, fontFamily: "'Outfit', sans-serif" }}>
                        Platform Management
                    </h1>
                    <p style={{ fontSize: '17px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '48px', maxWidth: '440px' }}>
                        Secure access to system administration tools. Manage users, monitor alerts, review system analytics, and maintain platform integrity.
                    </p>

                    {/* Feature List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { icon: <Users size={18} />, text: 'User and role management' },
                            { icon: <BarChart3 size={18} />, text: 'System analytics dashboard' },
                            { icon: <Activity size={18} />, text: 'Medication adherence monitoring' },
                            { icon: <Bell size={18} />, text: 'SOS alert moderation' },
                            { icon: <Database size={18} />, text: 'Content management system' },
                            { icon: <ShieldCheck size={18} />, text: 'Security monitoring tools' },
                            { icon: <FileSearch size={18} />, text: 'Audit logs tracking' },
                        ].map((f, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '12px 20px', borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s'
                            }} className="admin-feature">
                                <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>{f.icon}</div>
                                <span style={{ fontSize: '15px', fontWeight: '500', color: '#CBD5E1' }}>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT SIDE: ADMIN LOGIN FORM (55%) ──────────────────── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#F8FAFC' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DBEAFE', color: '#1E40AF', padding: '6px 16px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
                            <Lock size={12} /> Restricted Access
                        </div>
                        <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#0F172A', marginBottom: '10px', fontFamily: "'Outfit', sans-serif" }}>Admin Sign In</h2>
                        <p style={{ fontSize: '15px', color: '#64748B' }}>Access the ElderEase management console</p>
                    </div>

                    {error && (
                        <div 
                            role="alert" 
                            aria-live="assertive"
                            style={{
                                background: '#FFF1F2', color: '#E11D48', border: '1px solid #FDA4AF',
                                borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
                                fontSize: '14px', display: 'flex', gap: '12px', alignItems: 'center'
                            }}
                        >
                            <ShieldAlert size={18} /> <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Admin Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Admin Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email" placeholder="admin@elderease.com"
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
                            <label style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginLeft: '4px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
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
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={isLoading}
                            style={{
                                width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700',
                                background: isLoading ? '#94A3B8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                                color: 'white', border: 'none', borderRadius: '14px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                boxShadow: isLoading ? 'none' : '0 8px 20px rgba(30, 58, 138, 0.2)',
                                marginTop: '10px', transition: 'all 0.3s ease'
                            }} className="admin-login-btn">
                            {isLoading ? <><span className="loader" /> Signing in...</> : <><ShieldCheck size={20} /> Sign in to dashboard</>}
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', padding: '24px', background: '#F1F5F9', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
                            ⚠️ <strong>Security Note:</strong> Authorized personnel only. This system is protected by 256-bit encryption. All access attempts are logged.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .loader { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
                .admin-feature:hover { transform: translateX(8px); background: rgba(255, 255, 255, 0.15); border-color: rgba(255, 255, 255, 0.2); }
                .admin-login-btn:hover { transform: translateY(-2px); boxShadow: 0 12px 30px rgba(30, 58, 138, 0.3); }
                
                @media (max-width: 1024px) {
                    .login-panel-left { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Login;
