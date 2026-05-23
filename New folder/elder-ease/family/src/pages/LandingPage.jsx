import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Activity, Users, Bell, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 60%, #E2E8F0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>

            {/* Background decoration */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(23,46,109,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(30,58,138,0.35)' }}>
                    <Heart size={28} fill="white" color="white" />
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: '900', color: '#1E3A8A' }}>ElderEase</span>
            </div>

            {/* Hero text */}
            <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '52px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#E0E7FF', color: '#1E3A8A', padding: '7px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px', border: '1px solid #C7D2FE' }}>
                    <Users size={14} /> Family Caregiver Portal
                </div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', color: '#0F172A', lineHeight: 1.15, marginBottom: '18px', letterSpacing: '-0.02em' }}>
                    Care for Your <span style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Loved Ones</span>
                </h1>
                <p style={{ fontSize: '19px', color: '#64748B', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
                    Stay connected with your elderly family members, monitor their health, and share beautiful memories — all in one place.
                </p>
            </div>

            {/* Feature chips */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px', position: 'relative', zIndex: 1 }}>
                {[
                    { icon: <Activity size={16} />, text: 'Health Monitoring' },
                    { icon: <Shield size={16} />, text: 'Medication Tracking' },
                    { icon: <Bell size={16} />, text: 'SOS Alerts' },
                    { icon: <Heart size={16} />, text: 'Memory Wall' },
                ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '10px 18px', borderRadius: '999px', fontSize: '14px', fontWeight: '600', color: '#334155', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#1E3A8A' }}>{f.icon}</span>
                        {f.text}
                    </div>
                ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <Link to="/login" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    color: 'white', padding: '16px 36px', borderRadius: '14px',
                    fontWeight: '700', fontSize: '17px', textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(30,58,138,0.35)', transition: 'all 0.25s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,58,138,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,138,0.35)'; }}>
                    Family Login <ArrowRight size={19} />
                </Link>
                <a href="http://localhost:5173" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    background: 'white', color: '#334155', padding: '16px 36px', borderRadius: '14px',
                    fontWeight: '700', fontSize: '17px', textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.07)', border: '1.5px solid #E2E8F0', transition: 'all 0.25s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)'; }}>
                    Go to Elder Portal
                </a>
            </div>

            {/* Footer note */}
            <p style={{ marginTop: '52px', color: '#94A3B8', fontSize: '13px', position: 'relative', zIndex: 1 }}>
                © 2026 ElderEase · Dedicated to compassionate care
            </p>
        </div>
    );
};

export default LandingPage;
