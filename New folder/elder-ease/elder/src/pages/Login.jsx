import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Heart, Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
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
            if (user.role === 'Elder') {
                navigate('/dashboard');
            } else if (user.role === 'Family Member') {
                setError(
                    <span>
                        You are a Family Member. Please use the <a href="http://localhost:5175/login" style={{ color: '#1E3A8A', fontWeight: 700 }}>Family Portal</a>.
                    </span>
                );
            } else if (user.role === 'Admin') {
                setError(
                    <span>
                        You are an Admin. Please use the <a href="http://localhost:5174/login" style={{ color: '#1E3A8A', fontWeight: 700 }}>Admin Panel</a>.
                    </span>
                );
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            background: '#F5F9FF',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden'
        }} className="login-container">
            
            {/* LEFT SIDE — Login Form (40%) */}
            <div style={{
                flex: '0 0 40%',
                display: 'flex',
                flexDirection: 'column',
                padding: '40px 5%',
                justifyContent: 'center',
                background: '#F5F9FF',
                zIndex: 2,
                boxShadow: '10px 0 30px rgba(0,0,0,0.02)'
            }} className="login-left">
                
                {/* Logo & Header Section */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                        }}>
                            <Heart size={24} fill="white" color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', lineHeight: 1 }}>ElderEase</div>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', letterSpacing: '0.02em' }}>Assistive Care System</div>
                        </div>
                    </div>

                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: '#1E293B',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em'
                        }}>Welcome Back</h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#64748B',
                            lineHeight: 1.6
                        }}>
                            Login to access your health reminders, daily routines, and support tools.
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
                    {/* Error Message */}
                    {error && (
                        <div 
                            role="alert"
                            aria-live="assertive"
                            style={{
                                background: '#FFF1F2',
                                color: '#E11D48',
                                border: '1px solid #FDA4AF',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                marginBottom: '24px',
                                fontSize: '18px', // Larger for Elder portal
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                animation: 'shake 0.4s ease'
                            }}
                        >
                            <span style={{ fontSize: '22px' }}>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Email Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 16px 16px 48px',
                                        fontSize: '16px',
                                        background: '#FFFFFF',
                                        border: '2px solid #E2E8F0',
                                        borderRadius: '14px',
                                        color: '#1E293B',
                                        outline: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    className="login-input"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 52px 16px 48px',
                                        fontSize: '16px',
                                        background: '#FFFFFF',
                                        border: '2px solid #E2E8F0',
                                        borderRadius: '14px',
                                        color: '#1E293B',
                                        outline: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    className="login-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94A3B8',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#64748B', fontSize: '15px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe} 
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1E3A8A' }} 
                                />
                                Remember me
                            </label>
                            <Link to="/forgot-password" style={{ color: '#1E3A8A', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '18px',
                                fontSize: '18px',
                                fontWeight: '700',
                                background: isLoading ? '#94A3B8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)',
                                transition: 'all 0.3s ease',
                                marginTop: '10px'
                            }}
                            className="login-btn"
                        >
                            {isLoading ? (
                                <><span className="loader" /> Signing in...</>
                            ) : (
                                <>
                                    <LogIn size={22} />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p style={{ textAlign: 'center', color: '#64748B', fontSize: '16px', marginTop: '32px' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#1E3A8A', fontWeight: '800', textDecoration: 'none' }}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE — Image Section (60%) */}
            <div style={{
                flex: '0 0 60%',
                position: 'relative',
                background: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} className="login-right">
                {/* Semi-transparent Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.4), rgba(30, 41, 59, 0.7))',
                    backdropFilter: 'blur(2px)'
                }} />
                
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '40px',
                    maxWidth: '600px'
                }}>
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        marginBottom: '24px',
                        lineHeight: 1.1,
                        textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>Caring Support for Independent Living</h2>
                    <p style={{
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: 1.6,
                        fontWeight: '500'
                    }}>
                        Helping elders live safely, confidently, and comfortably every day.
                    </p>
                    
                    {/* Visual decor */}
                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px'
                    }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ width: '40px', height: '4px', background: i === 1 ? '#FFFFFF' : 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .login-input:focus {
                    border-color: #1E3A8A !important;
                    box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1) !important;
                }
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(30, 58, 138, 0.35);
                }
                .social-btn:hover {
                    background: #F8FAFC;
                    border-color: #CBD5E1;
                    transform: translateY(-1px);
                }
                .loader {
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top-color: #FFFFFF;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                @media (max-width: 1024px) {
                    .login-left { flex: 0 0 50%; }
                    .login-right { flex: 0 0 50%; }
                }

                @media (max-width: 768px) {
                    .login-container { flex-direction: column; overflow-y: auto; }
                    .login-left { flex: 1; padding: 120px 24px 60px; order: 2; }
                    .login-right { flex: 0 0 350px; order: 1; }
                    .login-right h2 { font-size: 32px; }
                }

                @media (max-width: 480px) {
                    .login-right { flex: 0 0 250px; }
                    .login-right h2 { font-size: 24px; }
                    .login-right p { font-size: 16px; }
                }
            `}</style>
        </div>
    );
};

export default Login;

