const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// OTP routes
router.post('/send-otp', authController.sendOTP);
router.post('/send-otp-email', authController.sendOTPEmail);

// Customer routes
router.post('/customer/signup', authController.customerSignup);
router.post('/customer/login', authController.customerLogin);

// Vendor routes
router.post('/vendor/signup', authController.vendorSignup);
router.post('/vendor/login', authController.vendorLogin);

module.exports = router;
