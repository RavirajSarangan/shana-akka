import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Elder' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await register(formData);
            if (user.role === 'Elder') {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '14px 18px', fontSize: '16px',
        border: '2px solid #E2E8F0', borderRadius: '12px',
        background: '#F8FAFC', outline: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', color: '#1E293B', fontFamily: 'inherit'
    };
    const focusIn = e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(30, 58, 138, 0.1)'; };
    const focusOut = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%', maxWidth: '500px',
                background: '#fff', borderRadius: '32px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', padding: '52px 44px',
                border: '1px solid #F1F5F9',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                    <div style={{
                        width: '42px', height: '42px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                    }}>
                        <Heart size={24} fill="white" color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>ElderEase</div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', letterSpacing: '0.02em' }}>Assistive Care System</div>
                    </div>
                </div>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#E0E7FF', color: '#1E3A8A', padding: '6px 16px',
                        borderRadius: '999px', fontSize: '12px', fontWeight: '800',
                        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px'
                    }}>
                        <UserPlus size={14} /> New Account
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1E293B', fontFamily: "'Outfit', sans-serif", marginBottom: '8px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                        Create Account
                    </h1>
                    <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6 }}>
                        Join the ElderEase care network today
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#FFF1F2', color: '#E11D48', border: '1px solid #FDA4AF',
                        borderRadius: '14px', padding: '16px 20px', marginBottom: '32px',
                        fontSize: '15px', display: 'flex', gap: '12px', alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '18px' }}>⚠️</span><span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Full Name</label>
                        <input
                            type="text" placeholder="Your full name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={inputStyle} required
                            onFocus={focusIn} onBlur={focusOut}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Email Address</label>
                        <input
                            type="email" placeholder="your@email.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle} required
                            onFocus={focusIn} onBlur={focusOut}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ ...inputStyle, paddingRight: '50px' }} required
                                onFocus={focusIn} onBlur={focusOut}
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                                    display: 'flex', alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginLeft: '4px' }}>Account Type</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                style={{ ...inputStyle, paddingRight: '42px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
                                onFocus={focusIn} onBlur={focusOut}
                            >
                                <option value="Elder">Elderly User</option>
                                <option value="Family Member">Family Member / Caregiver</option>
                            </select>
                            <ChevronDown size={20} color="#94A3B8" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%', padding: '18px', fontSize: '18px', fontWeight: '700',
                            background: isLoading ? '#94A3B8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                            color: 'white', border: 'none', borderRadius: '16px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            boxShadow: isLoading ? 'none' : '0 10px 25px rgba(30, 58, 138, 0.25)',
                            marginTop: '12px', transition: 'all 0.3s ease'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                Creating account...
                            </>
                        ) : (
                            <><UserPlus size={22} /> Create Account</>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '32px', color: '#64748B', fontSize: '16px' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#1E3A8A', fontWeight: '800', textDecoration: 'none' }}>Sign in here</Link>
                </p>
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
    );
};

export default Register;

