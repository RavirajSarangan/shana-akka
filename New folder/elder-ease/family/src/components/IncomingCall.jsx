import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

const IncomingCall = ({ incomingCall, callState, onAccept, onReject, onHangUp, remoteAudioRef }) => {
    return (
        <>
            {/* Remote audio element - always present */}
            <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />

            {/* Connecting bar */}
            {callState === 'calling' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
                    background: '#1E3A8A', color: 'white', padding: '12px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: '18px', fontWeight: '700'
                }}>
                    <span>Connecting audio...</span>
                    <button onClick={onHangUp} style={{
                        background: '#DC2626', color: 'white', border: 'none',
                        padding: '8px 20px', borderRadius: '50px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px'
                    }}>
                        <PhoneOff size={18} /> End Call
                    </button>
                </div>
            )}

            {/* In-call bar */}
            {callState === 'in-call' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
                    background: '#16A34A', color: 'white', padding: '12px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: '18px', fontWeight: '700'
                }}>
                    <span>Call in progress</span>
                    <button onClick={onHangUp} style={{
                        background: '#DC2626', color: 'white', border: 'none',
                        padding: '8px 20px', borderRadius: '50px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px'
                    }}>
                        <PhoneOff size={18} /> End Call
                    </button>
                </div>
            )}

            {/* Incoming call overlay */}
            {incomingCall && (
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
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                            Incoming Call
                        </h2>
                        <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '32px' }}>
                            {incomingCall.callerName} is calling
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button onClick={onReject} style={{
                                background: '#EF4444', color: 'white', border: 'none',
                                padding: '16px 24px', borderRadius: '50px', cursor: 'pointer',
                                fontSize: '16px', fontWeight: '700', display: 'flex',
                                alignItems: 'center', gap: '8px'
                            }}>
                                <PhoneOff size={20} /> Decline
                            </button>
                            <button onClick={onAccept} style={{
                                background: '#16A34A', color: 'white', border: 'none',
                                padding: '16px 24px', borderRadius: '50px', cursor: 'pointer',
                                fontSize: '16px', fontWeight: '700', display: 'flex',
                                alignItems: 'center', gap: '8px'
                            }}>
                                <Phone size={20} /> Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default IncomingCall;
