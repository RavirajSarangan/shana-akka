// Maps userId -> socketId for routing call signals
const onlineUsers = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        // Register user when they connect
        socket.on('register', (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.userId = userId;
        });

        // Elder initiates a call to a family member
        socket.on('call-request', ({ to, from, callerName }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('incoming-call', { from, callerName });
            } else {
                socket.emit('call-failed', { reason: 'Family member is not online right now.' });
            }
        });

        // Family member accepts the call
        socket.on('call-accept', ({ to }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('call-accepted');
            }
        });

        // Family member rejects the call
        socket.on('call-reject', ({ to }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('call-rejected');
            }
        });

        // End call from either side
        socket.on('call-end', ({ to }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('call-ended');
            }
        });

        // WebRTC signaling: SDP offer
        socket.on('webrtc-offer', ({ to, offer }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-offer', { from: socket.userId, offer });
            }
        });

        // WebRTC signaling: SDP answer
        socket.on('webrtc-answer', ({ to, answer }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('webrtc-answer', { answer });
            }
        });

        // WebRTC signaling: ICE candidates
        socket.on('ice-candidate', ({ to, candidate }) => {
            const targetSocketId = onlineUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('ice-candidate', { candidate });
            }
        });

        // Clean up on disconnect
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
            }
        });
    });
};
