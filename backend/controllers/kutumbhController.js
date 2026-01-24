const kutumbhService = require('../services/kutumbhService');
const crypto = require('crypto');

exports.createRoom = async (req, res, next) => {
    try {
        const { packageId, catererId } = req.body;
        const hostId = req.user.id; // From authMiddleware

        if (!catererId) {
            return res.status(400).json({ error: 'Caterer ID is required' });
        }

        // Generate specific roomId (human readable or random)
        const roomId = crypto.randomBytes(4).toString('hex'); // e.g. "a1b2c3d4"

        // Pass catererId to service. packageId is now optional/legacy context
        const room = await kutumbhService.createRoom(roomId, hostId, catererId, packageId);

        res.status(201).json({
            success: true,
            roomId: room.roomId,
            message: 'Kutumbh Room created successfully'
        });
    } catch (err) {
        next(err);
    }
};

exports.getRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const roomState = await kutumbhService.getRoomState(roomId);
        if (!roomState) return res.status(404).json({ error: 'Room not found' });
        res.json(roomState);
    } catch (err) {
        next(err);
    }
};

// Public endpoint for guests to join (no auth required)
exports.joinGuest = async (req, res, next) => {
    try {
        const { roomId, guestName } = req.body;

        if (!roomId || !guestName) {
            return res.status(400).json({ error: 'Room ID and guest name are required' });
        }

        const roomState = await kutumbhService.getRoomState(roomId);
        if (!roomState) return res.status(404).json({ error: 'Room not found' });

        res.json({
            success: true,
            roomState,
            guestName,
            message: 'Joined room successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Submit enquiry to caterer
exports.submitEnquiry = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const { additionalNotes } = req.body;



        // Create persistent enquiry
        const enquiry = await kutumbhService.createEnquiry(roomId, additionalNotes);



        res.json({
            success: true,
            message: 'Enquiry submitted successfully',
            enquiry
        });
    } catch (err) {
        console.error('[Submit Enquiry] ❌ Error:', err.message);
        console.error('[Submit Enquiry] Stack:', err.stack);
        next(err);
    }
};

// Get enquiries for logged-in caterer
exports.getCatererEnquiries = async (req, res, next) => {
    try {
        const userId = req.user.id;


        // 1. Find vendor profile
        const prisma = require('../utils/prisma'); // Need prisma here to find vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId }
        });

        if (!vendor) {
            console.error(`[Caterer API] ❌ No vendor found for userId: ${userId}`);
            return res.status(403).json({ error: 'Not authorized as caterer' });
        }



        const enquiries = await kutumbhService.getEnquiriesForCaterer(vendor.id);



        res.json({
            success: true,
            count: enquiries.length,
            enquiries
        });
    } catch (err) {
        next(err);
    }
};

// Respond to enquiry
exports.respondToEnquiry = async (req, res, next) => {
    try {
        const { enquiryId } = req.params;
        const { quotePrice, message } = req.body;

        // TODO: Validate ownership (enquiry.catererId === loggedInVendor.id)

        const enquiry = await kutumbhService.updateEnquiry(enquiryId, {
            quotePrice,
            catererMessage: message
        });

        res.json({
            success: true,
            message: 'Response sent successfully',
            enquiry
        });
    } catch (err) {
        next(err);
    }
};

// Get user enquiries
exports.getUserEnquiries = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const enquiries = await kutumbhService.getUserEnquiries(userId);

        res.json({
            success: true,
            count: enquiries.length,
            enquiries
        });
    } catch (err) {
        next(err);
    }
};

// Get public room state (no auth)
exports.getPublicRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const roomState = await kutumbhService.getRoomState(roomId);
        if (!roomState) return res.status(404).json({ error: 'Room not found' });

        // Return state without sensitive host information
        const publicState = {
            ...roomState,
            hostEmail: undefined // Hide email from public view
        };

        res.json(publicState);
    } catch (err) {
        next(err);
    }
};

// Accept enquiry and create booking
exports.acceptEnquiry = async (req, res, next) => {
    try {
        const { enquiryId } = req.params;
        const { address, eventDate } = req.body;
        const userId = req.user.id;



        const result = await kutumbhService.acceptEnquiry(enquiryId, userId, address, eventDate);



        res.json({
            success: true,
            message: 'Quote accepted and order created successfully',
            booking: result.booking,
            enquiry: result.enquiry
        });
    } catch (err) {
        console.error('[Accept Enquiry API] ❌ Error:', err.message);
        next(err);
    }
};
