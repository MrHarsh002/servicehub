// Usage: node scripts/mark_universal_vendor.js [email]
// This script sends vendor data to the backend via the API.

require('dotenv').config();
const axios = require('axios');

async function main() {
  const email = process.argv[2] || 'vendor@example.com';
  const API_URL = 'http://127.0.0.1:5000/api';

  console.log(`Attempting to register universal vendor: ${email}`);

  const vendorData = {
    businessName: 'Single Vendor',
    ownerName: 'Owner',
    email,
    phone: '9' + Math.floor(Math.random() * 900000000),
    password: 'password123',
    confirmPassword: 'password123',
    category: 'Other',
    licenseNumber: 'LIC-UNIVERSAL',
    address: '123 Main St',
    city: 'Mumbai'
  };

  try {
    const response = await axios.post(`${API_URL}/auth/vendor/signup`, vendorData);
    console.log('SUCCESS:', response.data.message);
    console.log('Vendor ID:', response.data.vendor.id);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'Email already registered') {
      console.log('NOTE: Vendor already exists. Attempting login to verify...');
      try {
        const loginRes = await axios.post(`${API_URL}/auth/vendor/login`, {
          email,
          password: 'password123'
        });
        console.log('SUCCESS: Vendor is already active.');
      } catch (loginErr) {
        console.error('FAILURE: Vendor exists but login failed:', loginErr.response?.data?.message || loginErr.message);
      }
    } else {
      console.error('FAILURE:', error.response?.data?.message || error.message);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });