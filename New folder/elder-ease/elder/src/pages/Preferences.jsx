import React from 'react';
import { ArrowLeft, Languages, Type, Eye, Volume2, Shield, Bell, HardDrive, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const Preferences = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage, accessibility, setAccessibility } = useUI();

    const handleAccessibility = (key) => {
        setAccessibility(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #F8FAFC 0%, #F1F5F9 40%, #E2E8F0 100%)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            {/* Top Navigation */}
            <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid rgba(30,58,138,0.1)'
            }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: '#FFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1E3A8A',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
                >
                    <ArrowLeft size={20} /> {t('back')}
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E3A8A', margin: 0 }}>{t('preferences')}</h1>
            </div>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                
                {/* ── LANGUAGE SECTION ──────────────────────────── */}
                <section style={{ marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: '#E0E7FF', padding: '10px', borderRadius: '12px' }}>
                            <Languages size={24} color="#1E3A8A" />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{t('language')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {['English', 'Sinhala', 'Tamil'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                style={{
                                    padding: '32px 24px',
                                    background: language === lang ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)' : 'white',
                                    color: language === lang ? 'white' : '#4B5563',
                                    borderRadius: '24px',
                                    border: 'none',
                                    fontSize: '22px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: language === lang ? '0 10px 20px rgba(30,58,138,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{lang}</span>
                                {language === lang && <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%' }}><Shield size={20} /></div>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── ACCESSIBILITY SECTION ─────────────────────── */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ background: '#E0E7FF', padding: '10px', borderRadius: '12px' }}>
                            <Type size={24} color="#1E3A8A" />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{t('accessibility')}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        
                        <PreferenceCard
                            icon={<Eye size={32} />}
                            title={t('highContrast')}
                            active={accessibility.highContrast}
                            onClick={() => handleAccessibility('highContrast')}
                            color="#1E3A8A"
                        />

                        <PreferenceCard
                            icon={<Type size={32} />}
                            title={`${t('largeFont')} (${accessibility.fontSize})`}
                            active={accessibility.fontSize !== 'Normal'}
                            onClick={() => setAccessibility(prev => ({
                                ...prev,
                                fontSize: prev.fontSize === 'Normal' ? 'Large' : prev.fontSize === 'Large' ? 'Extra Large' : 'Normal'
                            }))}
                            color="#1E3A8A"
                        />

                        <PreferenceCard
                            icon={<Volume2 size={32} />}
                            title={t('screenReader')}
                            active={accessibility.screenReader}
                            onClick={() => handleAccessibility('screenReader')}
                            color="#1E3A8A"
                        />
                        
                        <PreferenceCard
                            icon={<Bell size={32} />}
                            title="Voice Alerts"
                            active={true}
                            onClick={() => {}}
                            color="#1E3A8A"
                        />
                    </div>
                </section>

                {/* ── SYSTEM INFO ───────────────────────────────── */}
                <div style={{ marginTop: '64px', padding: '32px', background: 'rgba(30,58,138,0.05)', borderRadius: '24px', border: '1px dashed rgba(30,58,138,0.2)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', color: '#64748B', fontSize: '15px', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HardDrive size={18} /> Storage: 84% Free</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={18} /> System v1.2.4</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} /> Secure Connection</div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const PreferenceCard = ({ icon, title, active, onClick, color }) => (
    <button
        onClick={onClick}
        style={{
            padding: '24px',
            background: 'white',
            borderRadius: '24px',
            border: active ? `3px solid ${color}` : '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: active ? `0 12px 24px ${color}15` : '0 2px 10px rgba(0,0,0,0.03)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = active ? `0 12px 24px ${color}15` : '0 2px 10px rgba(0,0,0,0.03)'; }}
    >
        <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: active ? color : '#F3F4F6',
            color: active ? 'white' : '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: active ? color : '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {active ? 'Enabled' : 'Disabled'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#1F2937' }}>{title}</div>
        </div>
        <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: `2px solid ${active ? color : '#E5E7EB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active ? color : 'transparent'
        }}>
            {active && <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%' }} />}
        </div>
    </button>
);

export default Preferences;
