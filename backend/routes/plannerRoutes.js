const express = require('express');
const router = express.Router();
const { simulate } = require('../controllers/plannerController');

/**
 * POST /api/planner/simulate
 * Run event simulation and get recommendations
 */
router.post('/simulate', simulate);

module.exports = router;
