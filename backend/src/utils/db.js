const mongoose = require('mongoose');

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
  }

  try {
    cachedConnection = await connectionPromise;
    return cachedConnection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

module.exports = { connectDB };