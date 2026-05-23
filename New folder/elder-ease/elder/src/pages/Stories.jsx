import React from 'react';
import { useNavigate } from 'react-router-dom';
import StoryLibrary from '../components/StoryLibrary';

const Stories = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', padding: '30px', background: 'var(--secondary-color)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <StoryLibrary onBack={() => navigate('/dashboard')} />
            </div>
        </div>
    );
};

export default Stories;
