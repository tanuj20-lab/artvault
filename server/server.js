const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    console.log(`Socket ${socket.id} joined auction room: ${auctionId}`);
  });

  socket.on('leaveAuction', (auctionId) => {
    socket.leave(auctionId);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/artworks', require('./routes/artworkRoutes'));
app.use('/api/auctions', require('./routes/auctionRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Art Gallery API running 🎨' }));

// ── Serve React client in production ──────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  // Any non-API route → serve index.html (React Router handles it)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try stopping the existing server or set a different PORT in .env.`);
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
