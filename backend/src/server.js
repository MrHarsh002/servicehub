const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./utils/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Ensure database is connected before serving API requests.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(503).json({
      message: 'Database unavailable. Please try again shortly.',
      error: err.message
    });
  }
});

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Initial MongoDB connection failed:', err.message);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));

// Root route for Vercel deployments
app.get('/', (req, res) => {
  res.json({ status: 'Service booking API running' });
});

// Health check
app.get('/api/health', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'Server running',
    db: states[mongoose.connection.readyState] || 'unknown'
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
