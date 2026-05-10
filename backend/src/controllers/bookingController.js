const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Vendor = require('../models/Vendor');
const Customer = require('../models/Customer');

// Customer: Create booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, description, address, city, price } = req.body;
    const customerId = req.userId;

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = new Booking({
      customer: customerId,
      service: serviceId,
      scheduledDate,
      description,
      address,
      city,
      price: price || service.basePrice,
      status: 'Pending'
    });

    await booking.save();
    await booking.populate('service customer');

    // Add booking to customer
    await Customer.findByIdAndUpdate(customerId, {
      $push: { bookings: booking._id }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Customer: Get my bookings
exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.userId;

    const bookings = await Booking.find({ customer: customerId })
      .populate('service')
      .populate({
        path: 'vendor',
        select: 'businessName phone email'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Vendor: Get pending bookings
exports.getPendingBookings = async (req, res) => {
  try {
    const vendorId = req.userId;

    const vendor = await Vendor.findById(vendorId).select('category isUniversal');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const serviceIds = vendor.isUniversal
      ? (await Service.find({}).select('_id')).map(service => service._id)
      : (await Service.find({ category: vendor.category }).select('_id')).map(service => service._id);

    const query = {
      status: 'Pending',
      service: { $in: serviceIds },
      $or: [{ vendor: { $exists: false } }, { vendor: null }]
    };

    const bookings = await Booking.find(query)
      .populate('service')
      .populate({
        path: 'customer',
        select: 'name phone email address'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Vendor: Accept booking
exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const vendorId = req.userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Booking cannot be accepted' });
    }

    // Ensure vendor can only accept bookings in their own service category
    const [vendor, service] = await Promise.all([
      Vendor.findById(vendorId).select('category isUniversal'),
      Service.findById(booking.service).select('category')
    ]);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!vendor.isUniversal && vendor.category !== service.category) {
      return res.status(403).json({ message: 'You can only accept bookings in your category' });
    }

    booking.status = 'Accepted';
    booking.vendor = vendorId;
    booking.updatedAt = Date.now();
    await booking.save();

    // Add booking to vendor
    await Vendor.findByIdAndUpdate(vendorId, {
      $push: { acceptedBookings: booking._id }
    });

    await booking.populate('service customer vendor');

    res.status(200).json({
      message: 'Booking accepted successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting booking', error: error.message });
  }
};

// Vendor: Mark booking as in progress
exports.startBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const vendorId = req.userId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.vendor || booking.vendor.toString() !== vendorId) {
      return res.status(403).json({ message: 'You are not assigned to this booking' });
    }

    if (booking.status !== 'Accepted') {
      return res.status(400).json({ message: 'Only accepted bookings can be started' });
    }

    booking.status = 'In Progress';
    booking.updatedAt = Date.now();
    await booking.save();

    await booking.populate('service customer vendor');

    res.status(200).json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// Vendor: Mark booking as completed/delivered
exports.completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const vendorId = req.userId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.vendor || booking.vendor.toString() !== vendorId) {
      return res.status(403).json({ message: 'You are not assigned to this booking' });
    }

    if (booking.status !== 'In Progress') {
      return res.status(400).json({ message: 'Only in-progress bookings can be completed' });
    }

    booking.status = 'Completed';
    booking.updatedAt = Date.now();
    await booking.save();

    await booking.populate('service customer vendor');

    res.status(200).json({
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing booking', error: error.message });
  }
};

// Customer: Rate and review booking
exports.rateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.customerRating = rating;
    booking.customerReview = review;
    await booking.save();

    // Update vendor rating
    const vendorBookings = await Booking.find({
      vendor: booking.vendor,
      customerRating: { $exists: true }
    });

    const totalRating = vendorBookings.reduce((sum, b) => sum + b.customerRating, 0);
    const averageRating = totalRating / vendorBookings.length;

    await Vendor.findByIdAndUpdate(booking.vendor, {
      rating: averageRating,
      totalRatings: vendorBookings.length
    });

    res.status(200).json({
      message: 'Review submitted successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// Vendor: Get accepted bookings
exports.getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.userId;

    const bookings = await Booking.find({ vendor: vendorId })
      .populate('service')
      .populate({
        path: 'customer',
        select: 'name phone email address'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Vendor: Get dashboard stats
exports.getVendorStats = async (req, res) => {
  try {
    const vendorId = req.userId;
    const vendor = await Vendor.findById(vendorId).select('category isUniversal');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const bookings = await Booking.find({ vendor: vendorId }).select('status price');

    const stats = bookings.reduce(
      (acc, booking) => {
        const amount = Number(booking.price || 0);

        acc.totalBookings += 1;

        if (booking.status === 'Accepted') {
          acc.acceptedBookings += 1;
        }

        if (booking.status === 'In Progress') {
          acc.inProgressBookings += 1;
        }

        if (booking.status === 'Completed') {
          acc.completedBookings += 1;
          acc.totalRevenue += amount;
        }

        return acc;
      },
      {
        totalBookings: 0,
        acceptedBookings: 0,
        inProgressBookings: 0,
        completedBookings: 0,
        totalRevenue: 0
      }
    );

    const categoryServiceIds = vendor.isUniversal
      ? (await Service.find({}).select('_id')).map(service => service._id)
      : (await Service.find({ category: vendor.category }).select('_id')).map(service => service._id);

    const pendingAvailable = await Booking.countDocuments({
      status: 'Pending',
      service: { $in: categoryServiceIds },
      vendor: { $exists: false }
    });

    res.status(200).json({
      stats: {
        ...stats,
        pendingBookings: pendingAvailable
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor stats', error: error.message });
  }
};
