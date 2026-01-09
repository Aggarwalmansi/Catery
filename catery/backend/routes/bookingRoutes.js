const express = require('express');
const {
    createBooking,
    getMyBookings,
    getVendorBookings,
    updateBookingStatus,
    updateBooking,
    getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer Routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:id', protect, updateBooking);

// Vendor Routes
router.get('/vendor', protect, authorize('VENDOR'), getVendorBookings);

// Admin Routes
router.get('/all', protect, authorize('ADMIN'), getAllBookings);

// Booking Actions (State Machine)
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;
