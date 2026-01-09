const prisma = require('../utils/prisma');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
    try {
        const { vendorId, packageId, occasion, date, guestCount, totalAmount, notes, address } = req.body;
        const userId = req.user.id;

        if (!vendorId || !date || !guestCount || !address) {
            return res.status(400).json({ error: 'Missing required fields: vendorId, date, guestCount, and address are required' });
        }

        // Check if vendor is PAUSED
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId },
            select: { status: true }
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        if (vendor.status === 'PAUSED') {
            return res.status(400).json({ error: 'Currently not accepting new bookings. Please check back later.' });
        }

        // Validate date (must be in future)
        if (new Date(date) < new Date()) {
            return res.status(400).json({ error: 'Booking date must be in the future' });
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                vendorId,
                packageId,
                occasion,
                date: new Date(date),
                guestCount: parseInt(guestCount),
                totalAmount: parseFloat(totalAmount),
                status: 'PENDING',
                notes,
                address,
            },
        });

        res.status(201).json({ message: 'Booking request sent', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// @desc    Get bookings for current user (Customer)
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: {
                vendor: { select: { name: true, image: true, phone: true } },
                package: { select: { name: true, price: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// @desc    Get bookings for current vendor
// @route   GET /api/bookings/vendor
// @access  Private (Vendor)
const getVendorBookings = async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.id },
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor profile not found' });
        }

        const bookings = await prisma.booking.findMany({
            where: { vendorId: vendor.id },
            include: {
                user: { select: { name: true, email: true } },
                package: {
                    include: {
                        items: {
                            include: { menuItem: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor bookings' });
    }
};

// @desc    Update booking details (Customer)
// @route   PATCH /api/bookings/:id
// @access  Private (Customer)
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { guestCount, address, date } = req.body;
        const userId = req.user.id;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { package: true }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.userId.toString() !== userId.toString()) {
            console.log('[updateBooking] Auth mismatch:', { bookingUserId: booking.userId, sessionUserId: userId });
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (booking.status !== 'PENDING') {
            return res.status(400).json({ error: 'You can only edit pending bookings' });
        }

        let updateData = {};
        if (guestCount) {
            const count = parseInt(guestCount);
            if (isNaN(count) || count <= 0) {
                return res.status(400).json({ error: 'Invalid guest count' });
            }
            updateData.guestCount = count;

            // Use the provided package if it exists, or the one from the booking
            if (booking.package) {
                updateData.totalAmount = count * booking.package.price;
            } else if (booking.guestCount > 0) {
                const rate = booking.totalAmount / booking.guestCount;
                updateData.totalAmount = count * rate;
            }
        }
        if (address !== undefined) updateData.address = address; // Allow clearing address
        if (date) {
            if (new Date(date) < new Date()) {
                return res.status(400).json({ error: 'Booking date must be in the future' });
            }
            updateData.date = new Date(date);
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: updateData,
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error('[updateBooking] ERROR:', error);
        res.status(500).json({ error: 'Failed to update booking', message: error.message });
    }
};

// @desc    Update booking status (State Machine)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Vendor/Admin/User)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { vendor: true },
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Logic check: Validate transitions
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        const currentStatus = booking.status;
        let newStatus = status;

        // VENDOR TRANSITIONS
        if (userRole === 'VENDOR') {
            // Check ownership
            if (booking.vendor.userId.toString() !== userId.toString()) {
                console.log('[updateBookingStatus] Auth mismatch:', { vendorUserId: booking.vendor.userId, sessionUserId: userId });
                return res.status(403).json({ error: 'Not authorized to manage this booking' });
            }

            if (status === 'APPROVED' && currentStatus === 'PENDING') {
                newStatus = 'APPROVED';
            } else if (status === 'REJECTED' && currentStatus === 'PENDING') {
                newStatus = 'REJECTED_BY_VENDOR';
            } else if (status === 'COMPLETED' && currentStatus === 'CONFIRMED') {
                newStatus = 'COMPLETED';
            } else {
                return res.status(400).json({ error: `Invalid transition from ${currentStatus} to ${status}` });
            }
        }
        // CUSTOMER TRANSITIONS
        else if (userRole === 'CUSTOMER') {
            if (booking.userId.toString() !== userId.toString()) {
                console.log('[updateBookingStatus] Auth mismatch:', { bookingUserId: booking.userId, sessionUserId: userId });
                return res.status(403).json({ error: 'Not authorized' });
            }

            const targetStatus = status.toUpperCase();
            if (targetStatus === 'CANCELLED' && currentStatus === 'PENDING') {
                newStatus = 'CANCELLED';
            } else {
                return res.status(400).json({ error: 'You can only cancel pending bookings' });
            }
        }
        else {
            // Admin can do anything? strict for now
            return res.status(403).json({ error: 'Role not supported for status change' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: newStatus },
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                vendor: { select: { name: true } },
                user: { select: { name: true, email: true } },
                package: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all bookings' });
    }
};

module.exports = { createBooking, getMyBookings, getVendorBookings, updateBookingStatus, updateBooking, getAllBookings };
