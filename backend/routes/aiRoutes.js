const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * POST /api/ai/report
 * Generate professional PDF report
 */
router.post('/report', aiController.generateReport);

module.exports = router;
