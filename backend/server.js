// travel-booking-app/backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import packageRoutes from './routes/package.js';
import bookingRoutes from './routes/booking.js';
import paymentRoutes from './routes/payment.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set('io', io);

// Middleware
app.use(cors({
  origin:"http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
try {
  connectDB();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('New client connected');

  // Notify all clients when a new package is added
  socket.on('newPackage', (packageData) => {
    if (!packageData || !packageData.id) return;
    io.emit('packageAdded', packageData);
  });

  // Notify clients about booking updates
  socket.on('bookingUpdate', (data) => {
    if (!data || !data.bookingId) return;
    io.emit('bookingStatusUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  httpServer.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});