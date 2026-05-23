import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Activity, Mic, Users, ArrowRight, CheckCircle, Sparkles, Brain, Bell, Zap, Cloud, Eye } from 'lucide-react';
import heroImg from '../assets/real-care-hero.png';

import techImg from '../assets/tech-care.png';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div style={{ color: '#1E293B', overflowX: 'hidden', background: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>

            {/* ── NAV ─────────────────────────────────────────── */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', padding: '0 8%',
                alignItems: 'center', position: 'fixed', top: 0, width: '100%', height: '80px',
                background: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none', zIndex: 1000,
                borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
                transition: 'all 0.3s ease', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(42, 127, 255, 0.2)'
                    }}>
                        <Heart size={24} fill="white" color="white" />
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '26px', fontWeight: '800', color: '#1E293B' }}>
                        ElderEase
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links">
                    <a href="#how-it-works" style={{ textDecoration: 'none', color: '#64748B', fontWeight: '600', fontSize: '15px' }}>How it Works</a>
                    <a href="#features" style={{ textDecoration: 'none', color: '#64748B', fontWeight: '600', fontSize: '15px' }}>Your Home</a>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#1E293B', fontWeight: '700', fontSize: '15px' }}>Login</Link>
                    <Link to="/register" style={{
                        textDecoration: 'none', padding: '12px 28px',
                        background: '#1E293B', color: 'white', borderRadius: '12px',
                        fontWeight: '700', fontSize: '15px', transition: 'all 0.2s',
                        boxShadow: '0 8px 16px rgba(30, 41, 59, 0.15)'
                    }}>
                        Register
                    </Link>
                </div>
            </nav>

            {/* ── HERO ─────────────────────────────────────────── */}
            <section style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                padding: '120px 8% 80px', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '400px', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#E0E7FF', color: '#1E3A8A', padding: '8px 20px',
                            borderRadius: '999px', fontSize: '13px', fontWeight: '800',
                            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '32px'
                        }}>
                            Care with Compassion
                        </div>
                        <h1 style={{
                            fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(42px, 5.5vw, 76px)',
                            fontWeight: '900', lineHeight: 1.1, color: '#1E293B',
                            marginBottom: '28px', letterSpacing: '-0.03em'
                        }}>
                            Simple, Caring Technology<br />
                            for <span style={{ color: '#1E3A8A' }}>Elderly Well-Being</span>
                        </h1>
                        <p style={{ fontSize: '20px', color: '#64748B', maxWidth: '580px', marginBottom: '48px', lineHeight: 1.6 }}>
                            ElderEase provides modern, intelligent support that bridges the gap between independent living and total medical safety. We empower elders to maintain their routines while giving families absolute peace of mind.
                        </p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Link to="/login" style={{
                                padding: '18px 36px', background: '#1E293B', color: 'white',
                                borderRadius: '14px', fontWeight: '700', fontSize: '16px',
                                boxShadow: '0 10px 25px rgba(30, 41, 59, 0.2)', transition: 'all 0.3s'
                            }}>
                                Elder Portal
                            </Link>
                            <a href="#how-it-works" style={{
                                padding: '18px 36px', background: 'white', color: '#1E293B',
                                borderRadius: '14px', fontWeight: '700', fontSize: '16px',
                                border: '2px solid #E2E8F0', transition: 'all 0.3s'
                            }}>
                                See How It Works
                            </a>
                        </div>
                    </div>
                    <div style={{ flex: 1.2, minWidth: '400px', position: 'relative' }}>
                        <div style={{
                            position: 'relative', width: '100%', height: 'auto',
                            borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
                        }}>
                            <img src={heroImg} alt="Family caring for elder" style={{ width: '100%', display: 'block' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── THREE STEPS ─────────────────────────────────── */}
            <section id="how-it-works" style={{ padding: '100px 8%', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <div style={{ color: '#1E3A8A', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>The Process</div>
                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '42px', fontWeight: '800', color: '#1E293B' }}>
                            Seamless care connection in three steps
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '18px', maxWidth: '600px', margin: '20px auto 0' }}>
                            Technology shouldn't be a barrier. Getting started with ElderEase is designed to be completely stress-free for both elders and their families.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {[
                            { num: '01', title: 'Family Setup', desc: 'Caregivers securely register from their mobile portal, inputting medication schedules and emergency contacts.' },
                            { num: '02', title: 'Elder Personalization', desc: 'The elder’s portal adapts instantly, offering large icons, voice controls, and familiar visual reminders.' },
                            { num: '03', title: 'Continuous Sync', desc: 'Data, reminders, and alerts are instantly synchronized between portals in real-time, 24/7.' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                padding: '48px', borderRadius: '24px', background: '#F8FAFC',
                                border: '1px solid #F1F5F9', transition: 'all 0.3s'
                            }} className="step-card">
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#1E3A8A', marginBottom: '24px', background: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>{s.num}</div>
                                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '16px' }}>{s.title}</h3>
                                <p style={{ color: '#64748B', lineHeight: 1.7, fontSize: '16px' }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EXPERIENCE SECTION ──────────────────────────── */}
            <section id="features" style={{ padding: '100px 8%', background: '#F8FAFC', textAlign: 'center' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '36px', fontWeight: '800', color: '#1E293B', marginBottom: '60px' }}>
                    Choose your experience.
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    {/* Elder Portal Card */}
                    <div style={{
                        width: '400px', padding: '50px', background: 'white', borderRadius: '32px',
                        border: '1px solid #E2E8F0', textAlign: 'left', transition: 'all 0.3s'
                    }} className="experience-card">
                        <Users size={40} color="#1E3A8A" style={{ marginBottom: '30px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', marginBottom: '16px' }}>Elder Portal</h3>
                        <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>Large text, voice commands, and your daily routine simplified.</p>
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', fontWeight: '800', fontSize: '16px', textDecoration: 'none' }}>
                            Access Now <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* Family Portal Card */}
                    <div style={{
                        width: '400px', padding: '50px', background: '#1E293B', borderRadius: '32px',
                        textAlign: 'left', transition: 'all 0.3s', color: 'white'
                    }} className="experience-card">
                        <Heart size={40} color="#3B82F6" fill="#3B82F6" style={{ marginBottom: '30px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Family Portal</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>Comprehensive dashboard for visits, alerts, and care coordination.</p>
                        <a href="http://localhost:5175/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: '800', fontSize: '16px', textDecoration: 'none' }}>
                            Access Now <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── INTERSTITIAL IMAGE SECTION ──────────────────── */}
            <section style={{ padding: '40px 8%', background: '#F8FAFC' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        width: '100%', height: '500px',
                        background: `url(${techImg}) center/cover no-repeat`,
                        borderRadius: '40px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                            color: 'white'
                        }}>
                            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Real-time Support</p>
                            <p style={{ opacity: 0.9 }}>Advanced technology paired with human compassion.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TRUST SECTION ───────────────────────────────── */}
            <section style={{ padding: '100px 8%', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <div style={{ color: '#1E3A8A', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Commitment</div>
                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '42px', fontWeight: '800', color: '#1E293B' }}>
                            A foundation of medical trust.
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '18px', maxWidth: '600px', margin: '20px auto 0' }}>
                            Every feature is an extension of the guidance of geriatric specialists and certified caregivers to ensure clinical reliability.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {[
                            { icon: <Shield size={24} />, title: 'Predictive Safety', desc: 'AI algorithms detect anomalies in daily routines to alert families before emergencies happen.' },
                            { icon: <Mic size={24} />, title: 'Zero-Touch Interface', desc: 'Voice and motion sensors eliminate the need for complex mobile apps.' },
                            { icon: <Activity size={24} />, title: 'Clinical Analytics', desc: 'Daily health reports designed specifically for sharing with primary care physicians.' },
                            { icon: <Brain size={24} />, title: 'Cognitive Engagement', desc: 'Scientifically backed memory exercises and activities adapted to the user’s cognitive level.' },
                            { icon: <Users size={24} />, title: 'Circle of Care', desc: 'Coordinate with doctors, nurses, and family members in one synchronized communication hub.' },
                            { icon: <Bell size={24} />, title: 'Smart SOS Dispatch', desc: 'Intelligent emergency protocols that automatically route the right information to first responders.' },
                        ].map((f, i) => (
                            <div key={i} style={{
                                padding: '32px', borderRadius: '20px', background: 'white',
                                border: '1px solid #F1F5F9',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)', transition: 'all 0.3s'
                            }} className="trust-card">
                                <div style={{ color: '#1E3A8A', marginBottom: '20px' }}>{f.icon}</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', marginBottom: '10px' }}>{f.title}</h4>
                                <p style={{ color: '#64748B', fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer style={{ padding: '80px 8% 40px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px', marginBottom: '80px' }}>
                        <div style={{ flex: 2, minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '36px', height: '36px',
                                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Heart size={20} fill="white" color="white" />
                                </div>
                                <span style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', fontFamily: "'Outfit', sans-serif" }}>ElderEase</span>
                            </div>
                            <p style={{ color: '#64748B', fontSize: '16px', lineHeight: 1.7, maxWidth: '400px' }}>
                                Designing the infrastructure for dignified aging. Bridging the gap between medical safety and independent living.
                            </p>
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <h4 style={{ fontWeight: '800', color: '#1E293B', marginBottom: '24px' }}>Platform</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Link to="/login" style={{ color: '#64748B', textDecoration: 'none' }}>Elder Portal</Link>
                                <a href="http://localhost:5175/login" style={{ color: '#64748B', textDecoration: 'none' }}>Family Portal</a>
                                <a href="http://localhost:5174/login" style={{ color: '#64748B', textDecoration: 'none' }}>Admin Console</a>
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h4 style={{ fontWeight: '800', color: '#1E293B', marginBottom: '24px' }}>Contact</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ color: '#64748B' }}>hello@elderease.com</div>
                                <div style={{ color: '#64748B' }}>ElderEase Smart Care System</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '40px', display: 'flex', justifyContent: 'center', color: '#94A3B8', fontSize: '14px' }}>
                        © 2026 ElderEase Inc. All rights reserved. Designed with compassion for independent seniors.
                    </div>
                </div>
            </footer>

            <style>{`
                .nav-links a:hover { color: #1E3A8A !important; }
                .step-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); border-color: #1E3A8A; }
                .experience-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
                .trust-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border: 1px solid #E0E7FF; }
                
                @media (max-width: 768px) {
                    .nav-links { display: none; }
                    nav { padding: 0 5%; }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;

