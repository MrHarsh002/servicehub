const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Other'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  estimatedDuration: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
