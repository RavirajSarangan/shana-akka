import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useCall = (userId) => {
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteAudioRef = useRef(null);
    // Ref mirrors state so socket handlers inside useEffect always read the latest value
    const remoteUserIdRef = useRef(null);

    const [callState, setCallState] = useState('idle');
    const [incomingCall, setIncomingCall] = useState(null);
    const [callError, setCallError] = useState('');
    const [remoteUserId, setRemoteUserId] = useState(null);

    const updateRemoteUserId = (id) => {
        remoteUserIdRef.current = id;
        setRemoteUserId(id);
    };

    const createPeerConnection = (targetUserId) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.onicecandidate = (e) => {
            if (e.candidate && socketRef.current) {
                socketRef.current.emit('ice-candidate', { to: targetUserId, candidate: e.candidate });
            }
        };

        pc.ontrack = (e) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = e.streams[0];
            }
        };

        return pc;
    };

    const cleanUp = (notify, targetId) => {
        if (notify && targetId && socketRef.current) {
            socketRef.current.emit('call-end', { to: targetId });
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
            localStreamRef.current = null;
        }
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        updateRemoteUserId(null);
        setCallState('idle');
        setIncomingCall(null);
    };

    useEffect(() => {
        if (!userId) return;

        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('register', userId);
        });

        socket.on('incoming-call', ({ from, callerName }) => {
            setIncomingCall({ from, callerName });
        });

        socket.on('call-rejected', () => {
            setCallState('idle');
            setCallError('Call was declined.');
            updateRemoteUserId(null);
        });

        socket.on('call-ended', () => {
            cleanUp(false, null);
        });

        socket.on('call-failed', ({ reason }) => {
            setCallState('idle');
            setCallError(reason);
        });

        // Elder sends offer after family accepts — this is the main setup path for family
        socket.on('webrtc-offer', async ({ from, offer }) => {
            updateRemoteUserId(from);
            const pc = createPeerConnection(from);
            pcRef.current = pc;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc-answer', { to: from, answer });
            setCallState('in-call');
        });

        socket.on('webrtc-answer', async ({ answer }) => {
            if (pcRef.current) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on('ice-candidate', async ({ candidate }) => {
            if (pcRef.current && candidate) {
                try {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error('ICE candidate error', e);
                }
            }
        });

        return () => socket.disconnect();
    }, [userId]);

    // Family accepts: just signal server — WebRTC is set up when the offer arrives via webrtc-offer
    const acceptCall = useCallback(() => {
        if (!incomingCall) return;
        updateRemoteUserId(incomingCall.from);
        socketRef.current?.emit('call-accept', { to: incomingCall.from });
        setIncomingCall(null);
        setCallState('calling'); // Show "connecting" until webrtc-offer triggers 'in-call'
    }, [incomingCall]);

    const rejectCall = useCallback(() => {
        if (!incomingCall) return;
        socketRef.current?.emit('call-reject', { to: incomingCall.from });
        setIncomingCall(null);
    }, [incomingCall]);

    const hangUp = useCallback(() => {
        cleanUp(true, remoteUserIdRef.current);
    }, []);

    return {
        callState,
        incomingCall,
        callError,
        remoteAudioRef,
        acceptCall,
        rejectCall,
        hangUp
    };
};
