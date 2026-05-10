const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.log('\n--- TROUBLESHOOTING TIP ---');
      console.log('If you are seeing a timeout, check your IP whitelist in MongoDB Atlas.');
      console.log('Current public IP: 152.59.85.203');
      console.log('OR switch to local MongoDB by changing MONGODB_URI in .env to:');
      console.log('mongodb://localhost:27017/servicehub');
      console.log('---------------------------\n');
    }
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
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
