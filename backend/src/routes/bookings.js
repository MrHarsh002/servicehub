const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, customerMiddleware, vendorMiddleware } = require('../middleware/auth');

// Protected routes
router.use(authMiddleware);

// Customer routes
router.post('/', customerMiddleware, bookingController.createBooking);
router.get('/customer/my-bookings', customerMiddleware, bookingController.getCustomerBookings);
router.put('/:bookingId/rate', customerMiddleware, bookingController.rateBooking);

// Vendor routes
router.get('/vendor/pending', vendorMiddleware, bookingController.getPendingBookings);
router.get('/vendor/my-bookings', vendorMiddleware, bookingController.getVendorBookings);
router.get('/vendor/stats', vendorMiddleware, bookingController.getVendorStats);
router.put('/:bookingId/accept', vendorMiddleware, bookingController.acceptBooking);
router.put('/:bookingId/start', vendorMiddleware, bookingController.startBooking);
router.put('/:bookingId/complete', vendorMiddleware, bookingController.completeBooking);

module.exports = router;
