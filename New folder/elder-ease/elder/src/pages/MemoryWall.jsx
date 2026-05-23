import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MemoryWall = () => {
    const navigate = useNavigate();
    const { t } = useUI();
    const { user } = useAuth();
    const [memories, setMemories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/memory-wall/${user._id}`, {
                    headers: { 'x-auth-token': token }
                });
                setMemories(res.data);
            } catch (err) {
                console.error(err);
                // Fallback demo memories
                setMemories([
                    { _id: '1', title: 'Grandkids', contentUrl: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?w=800', caption: 'Visiting the park last Sunday', uploadedBy: { name: 'Sarah' } },
                    { _id: '2', title: 'Garden', contentUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800', caption: 'The roses are blooming!', uploadedBy: { name: 'Mark' } }
                ]);
            }
        };
        if (user) fetchMemories();
    }, [user]);

    // Auto rotate every 10 seconds
    useEffect(() => {
        if (memories.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % memories.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [memories]);

    const next = () => setCurrentIndex((currentIndex + 1) % memories.length);
    const prev = () => setCurrentIndex((currentIndex - 1 + memories.length) % memories.length);

    return (
        <div className="elder-mode" style={{ 
            minHeight: '100vh', 
            padding: '40px', 
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <button onClick={() => navigate('/dashboard')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                marginBottom: '40px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: '700',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <ArrowLeft /> {t('back')}
            </button>

            {memories.length > 0 ? (
                <div style={{ position: 'relative', height: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <img
                            src={memories[currentIndex].contentUrl}
                            alt={memories[currentIndex].title}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '70%',
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                objectFit: 'contain'
                            }}
                        />
                        <div style={{ color: '#fff', textAlign: 'center', marginTop: '30px', width: '100%' }}>
                            <h1 style={{ fontSize: '48px', color: '#fff', fontWeight: '900', margin: '0 0 10px 0' }}>{memories[currentIndex].title}</h1>
                            <p style={{ fontSize: '32px', opacity: 0.9, fontWeight: '500' }}>{memories[currentIndex].caption}</p>
                            <p style={{ fontSize: '24px', marginTop: '20px', color: '#3B82F6', fontWeight: '800' }}>
                                <Heart style={{ display: 'inline', marginRight: '10px' }} fill="currentColor" />
                                From {memories[currentIndex].uploadedBy?.name || 'Family'}
                            </p>
                        </div>
                    </div>

                    <button onClick={prev} style={navButtonStyle('left')}><ChevronLeft size={60} /></button>
                    <button onClick={next} style={navButtonStyle('right')}><ChevronRight size={60} /></button>
                </div>
            ) : (
                <div style={{ textAlign: 'center', color: '#fff', marginTop: '100px' }}>
                    <h1>Waiting for memories...</h1>
                    <p style={{ fontSize: '24px' }}>Family members can upload photos from their portal.</p>
                </div>
            )}
        </div>
    );
};

const navButtonStyle = (side) => ({
    position: 'absolute',
    [side]: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    padding: '20px',
    cursor: 'pointer',
    borderRadius: side === 'left' ? '0 20px 20px 0' : '20px 0 0 20px'
});

export default MemoryWall;
