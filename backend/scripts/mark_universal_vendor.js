// Usage: node scripts/mark_universal_vendor.js [email]
// Defaults to vendor@example.com.

require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../src/models/Vendor');

async function main() {
  const email = process.argv[2] || 'vendor@example.com';

  await mongoose.connect(process.env.MONGODB_URI);

  let vendor = await Vendor.findOne({ email });
  if (!vendor) {
    vendor = new Vendor({
      businessName: 'Single Vendor',
      ownerName: 'Owner',
      email,
      phone: '9999999999',
      password: 'password123',
      category: 'Other',
      isUniversal: true,
      isVerified: true
    });
  } else {
    vendor.isUniversal = true;
    vendor.isVerified = true;
  }

  await vendor.save();
  console.log('Marked universal vendor:', vendor.email);

  await mongoose.connection.close();
}

main().catch(err => { console.error(err); process.exit(1); });