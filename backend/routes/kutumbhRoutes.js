const express = require('express');
const router = express.Router();
const kutumbhController = require('../controllers/kutumbhController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists

router.post('/create', protect, kutumbhController.createRoom);

// Public routes (no auth required)
router.post('/join-guest', kutumbhController.joinGuest);

// Specific protected routes (MUST come before /:roomId)
router.get('/caterer/list', protect, kutumbhController.getCatererEnquiries);
router.get('/user/list', protect, kutumbhController.getUserEnquiries);
router.post('/respond/:enquiryId', protect, kutumbhController.respondToEnquiry);
router.post('/accept/:enquiryId', protect, kutumbhController.acceptEnquiry);

// Parameterized routes (place these last)
router.get('/:roomId', protect, kutumbhController.getRoom);
router.get('/:roomId/public', kutumbhController.getPublicRoom);
router.post('/:roomId/enquiry', protect, kutumbhController.submitEnquiry);

module.exports = router;
