import React, { useRef } from 'react';
import { Phone, PhoneOff } from 'lucide-react';

const CallButton = ({ familyMembers, callState, callError, onCall, onHangUp, remoteAudioRef }) => {
    const localAudio = useRef(null);

    if (!familyMembers || familyMembers.length === 0) return null;

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
                Call Family
            </h3>

            {callError && (
                <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', marginBottom: '12px', fontSize: '16px' }}>
                    {callError}
                </div>
            )}

            {callState === 'idle' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {familyMembers.map((member) => (
                        <button
                            key={member._id || member.userId}
                            onClick={() => onCall(member.userId || member._id, member.name)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: '#1E3A8A', color: 'white', border: 'none',
                                padding: '14px 20px', borderRadius: '50px', cursor: 'pointer',
                                fontSize: '18px', fontWeight: '600',
                                boxShadow: '0 4px 12px rgba(30,58,138,0.3)'
                            }}
                        >
                            <Phone size={22} />
                            Call {member.name}
                        </button>
                    ))}
                </div>
            )}

            {callState === 'calling' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '18px', color: '#64748B' }}>Calling... ringing</div>
                    <button
                        onClick={onHangUp}
                        style={{ background: '#EF4444', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
                    >
                        <PhoneOff size={20} /> Cancel
                    </button>
                </div>
            )}

            {callState === 'in-call' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '18px', color: '#16A34A', fontWeight: '600' }}>
                        Call connected
                    </div>
                    <button
                        onClick={onHangUp}
                        style={{ background: '#EF4444', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
                    >
                        <PhoneOff size={20} /> End Call
                    </button>
                </div>
            )}

            {/* Hidden audio elements for WebRTC */}
            <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: 'none' }} />
            <audio ref={localAudio} muted playsInline style={{ display: 'none' }} />
        </div>
    );
};

export default CallButton;
