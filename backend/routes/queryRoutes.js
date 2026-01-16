const express = require('express');
const router = express.Router();
const {
    createQuery,
    getMyQueries,
    getAllQueries,
    updateQueryStatus
} = require('../controllers/queryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public/User routes
router.post('/', protect, createQuery);
router.get('/my-queries', protect, getMyQueries);

// Admin routes
router.get('/', protect, admin, getAllQueries);
router.patch('/:id', protect, admin, updateQueryStatus);

module.exports = router;
