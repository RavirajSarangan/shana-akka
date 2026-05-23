import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Heart, ArrowRight } from 'lucide-react';

const RoleSelection = () => {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
            padding: '40px 20px', gap: '0'
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '52px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(30,58,138,0.3)' }}>
                    <Heart size={26} fill="white" color="white" />
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: '900', color: '#1E3A8A' }}>ElderEase</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', color: '#0F172A', marginBottom: '14px', lineHeight: 1.15 }}>
                    How can we help you today?
                </h1>
                <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '440px', lineHeight: 1.6 }}>
                    Choose your role to get a personalised experience built just for you.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '760px', width: '100%' }}>
                {/* Elder Mode */}
                <Link to="/elder" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '20px', flex: 1, minWidth: '280px', height: '320px',
                    background: 'white', border: '2.5px solid #E5E7EB', borderRadius: '24px',
                    textDecoration: 'none', color: '#1E3A8A',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)', transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(30,58,138,0.18)'; e.currentTarget.style.borderColor = '#1E3A8A'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: '#F1F5F9', borderRadius: '50%' }} />
                    <div style={{ width: '90px', height: '90px', background: '#F1F5F9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <User size={52} color="#1E3A8A" />
                    </div>
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1E3A8A', fontFamily: "'Outfit', sans-serif", margin: 0, marginBottom: '8px' }}>Elder Mode</h2>
                        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '220px', lineHeight: 1.5 }}>
                            Simple interface with reminders and help.
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '700', color: '#1E3A8A', position: 'relative', zIndex: 1 }}>
                        Get started <ArrowRight size={17} />
                    </div>
                </Link>

                {/* Family Mode */}
                <Link to="/family" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '20px', flex: 1, minWidth: '280px', height: '320px',
                    background: 'linear-gradient(145deg, #1E3A8A, #3B82F6)', borderRadius: '24px',
                    textDecoration: 'none', color: 'white',
                    boxShadow: '0 12px 32px rgba(30,58,138,0.3)', transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(30,58,138,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,58,138,0.3)'; }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '130px', height: '130px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                    <div style={{ width: '90px', height: '90px', background: 'rgba(255,255,255,0.2)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <Users size={52} color="white" />
                    </div>
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white', fontFamily: "'Outfit', sans-serif", margin: 0, marginBottom: '8px' }}>Family Mode</h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', maxWidth: '220px', lineHeight: 1.5 }}>
                            Monitor medications and wellness from afar.
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', position: 'relative', zIndex: 1 }}>
                        Get started <ArrowRight size={17} />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default RoleSelection;
