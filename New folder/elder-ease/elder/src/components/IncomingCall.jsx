import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

const IncomingCall = ({ incomingCall, onAccept, onReject }) => {
    if (!incomingCall) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '24px', padding: '48px 40px',
                textAlign: 'center', maxWidth: '380px', width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    width: '80px', height: '80px', background: '#E0E7FF',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 20px'
                }}>
                    <Phone size={40} color="#1E3A8A" />
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                    Incoming Call
                </h2>
                <p style={{ fontSize: '20px', color: '#64748B', marginBottom: '36px' }}>
                    {incomingCall.callerName} is calling you
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={onReject}
                        style={{
                            background: '#EF4444', color: 'white', border: 'none',
                            padding: '18px 28px', borderRadius: '50px', cursor: 'pointer',
                            fontSize: '18px', fontWeight: '700', display: 'flex',
                            alignItems: 'center', gap: '10px'
                        }}
                    >
                        <PhoneOff size={24} /> Decline
                    </button>
                    <button
                        onClick={onAccept}
                        style={{
                            background: '#16A34A', color: 'white', border: 'none',
                            padding: '18px 28px', borderRadius: '50px', cursor: 'pointer',
                            fontSize: '18px', fontWeight: '700', display: 'flex',
                            alignItems: 'center', gap: '10px'
                        }}
                    >
                        <Phone size={24} /> Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCall;
