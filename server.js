require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET', 'POST'] }
});

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parking', require('./routes/parking'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'SmartPark API is running', timestamp: new Date() }));

// Socket.IO for real-time slot updates
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('joinParkingArea', (areaId) => socket.join(areaId));
  socket.on('leaveParkingArea', (areaId) => socket.leave(areaId));
  socket.on('disconnect', () => console.log(`🔌 Client disconnected: ${socket.id}`));
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 SmartPark Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO enabled`);
  console.log(`🗄️  API: http://localhost:${PORT}/api\n`);
});
