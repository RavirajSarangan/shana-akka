import React from 'react';
import { Sparkles, Music, BookOpen, Wind, ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wellness = () => {
    const navigate = useNavigate();

    return (
        <div className="elder-mode" style={{ minHeight: '100vh', padding: '30px' }}>
            <button onClick={() => navigate('/elder')} className="big-button" style={{
                flexDirection: 'row', padding: '15px 25px', marginBottom: '30px', border: 'none', background: '#1E3A8A', color: 'white'
            }}>
                <ArrowLeft /> Back
            </button>

            <h1 style={{ marginBottom: '10px' }}>Relax & Enjoy</h1>
            <p style={{ fontSize: '24px', color: 'var(--text-light)', marginBottom: '40px' }}>How would you like to relax right now?</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <WellnessOption icon={<Music size={60} />} title="Calming Music" />
                <WellnessOption icon={<Wind size={60} />} title="Breathing Exercises" />
                <WellnessOption icon={<BookOpen size={60} />} title="Read a Story" />
                <WellnessOption icon={<Heart size={60} />} title="Call Family" color="#1E3A8A" />
            </div>
        </div>
    );
};

const WellnessOption = ({ icon, title, color = '#1E3A8A' }) => (
    <button className="big-button" style={{ height: '250px', borderColor: color, color: color }}>
        {icon}
        <h2 style={{ marginTop: '20px', fontSize: '28px' }}>{title}</h2>
    </button>
);

export default Wellness;
