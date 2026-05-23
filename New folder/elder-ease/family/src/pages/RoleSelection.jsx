import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users } from 'lucide-react';

const RoleSelection = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'var(--secondary-color)',
            padding: '20px'
        }}>
            <h1 style={{ marginBottom: '50px', fontSize: '48px', textAlign: 'center', color: '#1E3A8A', fontWeight: '900' }}>How can we help you today?</h1>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/elder" className="big-button" style={{ minWidth: '300px', height: '350px' }}>
                    <User size={120} color="#1E3A8A" />
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '32px', color: '#1E3A8A' }}>Elder Mode</h2>
                        <p style={{ fontSize: '18px', fontWeight: 'normal', color: 'var(--text-light)', marginTop: '10px' }}>
                            Simple interface with reminders and help.
                        </p>
                    </div>
                </Link>

                <Link to="/family" className="big-button" style={{ minWidth: '300px', height: '350px' }}>
                    <Users size={120} color="#1E3A8A" />
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '32px', color: '#1E3A8A' }}>Family Mode</h2>
                        <p style={{ fontSize: '18px', fontWeight: 'normal', color: 'var(--text-light)', marginTop: '10px' }}>
                            Monitor medications and wellness.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default RoleSelection;
