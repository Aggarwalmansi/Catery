const express = require('express');
const router = express.Router();
const akshayaController = require('../controllers/akshayaController');

/**
 * POST /api/akshaya/optimize
 * Calculate optimized food quantities based on event details
 */
router.post('/optimize', akshayaController.optimizeQuantity);

/**
 * POST /api/akshaya/chat
 * Handle follow-up questions for the catering expert AI
 */
router.post('/chat', akshayaController.chat);

module.exports = router;
