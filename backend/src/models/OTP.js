const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: function() { return !this.email; }
  },
  email: {
    type: String,
    required: function() { return !this.phone; }
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 } // Auto delete after 5 minutes
  }
});

module.exports = mongoose.model('OTP', otpSchema);
