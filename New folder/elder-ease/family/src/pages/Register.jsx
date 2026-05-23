import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Family Member' });
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
            if (user.role === 'Family Member') { navigate('/'); } else { navigate('/login'); }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setIsLoading(false); }
    };

    const inputStyle = { width: '100%', padding: '13px 16px', fontSize: '15px', border: '1.5px solid #E2E8F0', borderRadius: '11px', background: '#F8FAFC', outline: 'none', transition: 'all 0.2s', color: '#1E293B', fontFamily: 'inherit' };
    const focusIn  = e => { e.target.style.borderColor = '#1E3A8A'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.15)'; };
    const focusOut = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)', padding: '40px 20px' }}>
            <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '22px', boxShadow: '0 20px 50px rgba(0,0,0,0.10)', padding: '48px 40px', border: '1px solid #F1F5F9' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(30,58,138,0.3)' }}>
                        <Heart size={21} fill="white" color="white" />
                    </div>
                    <span style={{ fontSize: '21px', fontWeight: '800', color: '#1E3A8A', fontFamily: "'Outfit', sans-serif" }}>ElderEase</span>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E0E7FF', color: '#1E3A8A', padding: '5px 13px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                    <UserPlus size={13} /> Family Portal
                </div>
                <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', fontFamily: "'Outfit', sans-serif", marginBottom: '6px', lineHeight: 1.2 }}>Create Account</h1>
                <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '28px' }}>Join the ElderEase caregiver network</p>

                {error && (
                    <div style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: '11px', padding: '12px 15px', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span>⚠️</span><span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '7px' }}>Full Name</label>
                        <input type="text" placeholder="Your full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '7px' }}>Email Address</label>
                        <input type="email" placeholder="family@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} required onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '7px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ ...inputStyle, paddingRight: '46px' }} required onFocus={focusIn} onBlur={focusOut} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '7px' }}>Account Type</label>
                        <div style={{ position: 'relative' }}>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ ...inputStyle, paddingRight: '40px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }} onFocus={focusIn} onBlur={focusOut}>
                                <option value="Elder">Elderly User</option>
                                <option value="Family Member">Family Member / Caregiver</option>
                            </select>
                            <ChevronDown size={17} color="#94A3B8" style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading}
                        style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '700', background: isLoading ? '#CBD5E1' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)', color: 'white', border: 'none', borderRadius: '11px', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', boxShadow: isLoading ? 'none' : '0 4px 14px rgba(30,58,138,0.35)', marginTop: '6px', transition: 'all 0.2s' }}>
                        {isLoading ? (<><span style={{ width: '17px', height: '17px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Creating account…</>) : (<><UserPlus size={18} /> Create Account</>)}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '22px', color: '#64748B', fontSize: '14px' }}>
                    Already have an account? <Link to="/login" style={{ color: '#1E3A8A', fontWeight: '700' }}>Sign in here</Link>
                </p>
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
    );
};

export default Register;
