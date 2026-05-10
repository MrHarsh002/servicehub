const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = { generateOTP, generateHash };
