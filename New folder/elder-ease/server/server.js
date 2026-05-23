const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
  res.send('ElderEase API is running...');
});

// Socket.io call signaling
require('./socket/callHandler')(io);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elder-ease';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/routines', require('./routes/routines'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/family', require('./routes/family'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/wellness', require('./routes/wellness'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/memory-wall', require('./routes/memoryWall'));
app.use('/api/cognitive', require('./routes/cognitive'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/assistant', require('./routes/assistant'));
