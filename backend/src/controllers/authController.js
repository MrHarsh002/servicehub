const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const OTP = require('../models/OTP');
const { generateToken } = require('../utils/jwt');
const { generateOTP } = require('../utils/otp');
const { sendOTPSMS } = require('../utils/sms');
const { sendOTPEmail: sendOTPEmailUtil } = require('../utils/email');

// Send OTP to phone number
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete previous OTP if exists
    await OTP.deleteMany({ phone });

    // Save new OTP
    const otpRecord = new OTP({ phone, otp });
    await otpRecord.save();

    // Send OTP via SMS
    const smsResult = await sendOTPSMS(phone, otp);

    if (smsResult.success) {
      res.status(200).json({
        message: smsResult.devMode ? 'OTP generated successfully (dev mode)' : 'OTP sent successfully',
        phone,
        ...(smsResult.devMode ? { devOtp: otp } : {})
      });
    } else {
      res.status(500).json({ message: 'Failed to send OTP', error: smsResult.error || 'Unknown SMS error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Send OTP to email for signup
exports.sendOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete previous OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    // Send OTP via Email
    const emailResult = await sendOTPEmailUtil(email, otp);

    if (emailResult.success) {
      res.status(200).json({
        message: emailResult.devMode ? 'OTP generated successfully (dev mode)' : 'OTP sent successfully',
        email,
        ...(emailResult.devMode ? { devOtp: otp } : {})
      });
    } else {
      res.status(500).json({ message: 'Failed to send OTP', error: emailResult.error || 'Unknown email error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Customer Signup with OTP
exports.customerSignup = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    // Verify OTP (by phone or email)
    let otpRecord = null;
    if (phone && email) {
      // Try to find by phone OR email
      otpRecord = await OTP.findOne({ 
        $or: [
          { phone, otp },
          { email, otp }
        ]
      });
    } else if (phone) {
      otpRecord = await OTP.findOne({ phone, otp });
    } else if (email) {
      otpRecord = await OTP.findOne({ email, otp });
    } else {
      return res.status(400).json({ message: 'Phone or email is required for OTP verification' });
    }

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create customer
    const customer = new Customer({
      name,
      email,
      phone,
      password,
      isOtpVerified: true
    });

    await customer.save();

    // Delete OTP
    if (phone) {
      await OTP.deleteOne({ phone, otp });
    } else {
      await OTP.deleteOne({ email, otp });
    }

    // Generate token
    const token = generateToken(customer._id, 'customer');

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        profileImage: customer.profileImage,
        isOtpVerified: customer.isOtpVerified,
        bookings: customer.bookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};

// Vendor Signup
exports.vendorSignup = async (req, res) => {
  try {
    const { businessName, ownerName, email, phone, password, category, licenseNumber } = req.body;

    if (email !== 'vendor@example.com') {
      return res.status(403).json({ message: 'Only vendor@example.com is allowed as the single vendor account' });
    }

    // Check if email already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create vendor
    const vendor = new Vendor({
      businessName,
      ownerName,
      email,
      phone,
      password,
      category,
      licenseNumber,
      isVerified: true,
      isUniversal: true
    });

    await vendor.save();

    // Generate token
    const token = generateToken(vendor._id, 'vendor');

    res.status(201).json({
      message: 'Vendor registered successfully',
      token,
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        category: vendor.category,
        address: vendor.address,
        city: vendor.city,
        licenseNumber: vendor.licenseNumber,
        profileImage: vendor.profileImage,
        rating: vendor.rating,
        totalRatings: vendor.totalRatings,
        isVerified: vendor.isVerified,
        acceptedBookings: vendor.acceptedBookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
};

// Customer Login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await customer.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(customer._id, 'customer');

    res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        profileImage: customer.profileImage,
        isOtpVerified: customer.isOtpVerified,
        bookings: customer.bookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Vendor Login
exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await vendor.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(vendor._id, 'vendor');

    res.status(200).json({
      message: 'Login successful',
      token,
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        category: vendor.category,
        address: vendor.address,
        city: vendor.city,
        licenseNumber: vendor.licenseNumber,
        profileImage: vendor.profileImage,
        rating: vendor.rating,
        totalRatings: vendor.totalRatings,
        isVerified: vendor.isVerified,
        acceptedBookings: vendor.acceptedBookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};
