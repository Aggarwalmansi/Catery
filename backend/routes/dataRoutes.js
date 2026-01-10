const express = require('express');
const { getOccasions, getVendors, getVendorById, getVendorPackages } = require('../controllers/dataController');

const { optionalProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/occasions', getOccasions);
router.get('/vendors', optionalProtect, getVendors);
router.get('/vendors/:id', optionalProtect, getVendorById);
router.get('/vendors/:id/packages', optionalProtect, getVendorPackages);

module.exports = router;
