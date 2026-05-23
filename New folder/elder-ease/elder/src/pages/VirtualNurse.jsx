import React from 'react';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import VoiceAssistant from '../components/VoiceAssistant';

const VirtualNurse = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontFamily: "'Outfit', sans-serif" }}>
            {/* Header */}
            <header style={{ 
                background: 'white', 
                color: '#1E293B', 
                padding: '20px 40px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                zIndex: 10 
            }}>
                <Link to="/dashboard" style={{ color: '#64748B', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={36} />
                </Link>
                <div style={{ 
                    background: '#E0E7FF', 
                    padding: '15px', 
                    borderRadius: '50%', 
                    border: '2px solid #1E3A8A', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    <HeartPulse size={40} color="#1E3A8A" />
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '32px', color: '#1E293B', fontWeight: 'bold' }}>AI Virtual Nurse</h1>
                    <p style={{ margin: 0, fontSize: '18px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '10px', height: '10px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }}></span>
                        Always here to listen and help
                    </p>
                </div>
            </header>

            {/* Content Area */}
            <main style={{ flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VoiceAssistant />
            </main>

            {/* Info Footer */}
            <footer style={{ padding: '30px 40px', textAlign: 'center', color: '#64748B', fontSize: '18px' }}>
                <p>Try asking: <strong>"Show my medications"</strong>, <strong>"What is my routine?"</strong>, <strong>"Show my reminders"</strong>, or <strong>"Hello"</strong></p>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>You can ask similar questions in different ways and I'll understand you.</p>
            </footer>
        </div>
    );
};

export default VirtualNurse;
