const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createVendorProfile,
    getMyVendorProfile,
    updateVendorProfile,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllVendors,
    verifyVendor,
    createPackage,
    getPackages,
    updatePackage,
    deletePackage,
    toggleVendorStatus,
    getAdminStats,
    adminUpdateVendorStatus,
    deleteVendor,
    getVendorStats,
} = require('../controllers/vendorController');

const router = express.Router();

// Onboarding (Any auth user can become a vendor)
router.post('/onboard', protect, createVendorProfile);

// Vendor Routes (Must have Role VENDOR)
router.get('/me', protect, authorize('VENDOR', 'ADMIN'), getMyVendorProfile);
router.get('/stats', protect, authorize('VENDOR'), getVendorStats);
router.put('/me', protect, authorize('VENDOR'), updateVendorProfile);
router.patch('/me/status', protect, authorize('VENDOR'), toggleVendorStatus);

// Menu Management
router.post('/menu', protect, authorize('VENDOR'), addMenuItem);
router.put('/menu/:id', protect, authorize('VENDOR'), updateMenuItem);
router.delete('/menu/:id', protect, authorize('VENDOR'), deleteMenuItem);

// Package Management
router.post('/packages', protect, authorize('VENDOR'), createPackage);
router.get('/packages', protect, authorize('VENDOR'), getPackages);
router.put('/packages/:id', protect, authorize('VENDOR'), updatePackage);
router.delete('/packages/:id', protect, authorize('VENDOR'), deletePackage);

// Admin Routes
router.get('/admin/all', protect, authorize('ADMIN'), getAllVendors);
router.get('/admin/stats', protect, authorize('ADMIN'), getAdminStats);
router.patch('/admin/:id/verify', protect, authorize('ADMIN'), verifyVendor);
router.patch('/admin/:id/status', protect, authorize('ADMIN'), adminUpdateVendorStatus);
router.delete('/admin/:id', protect, authorize('ADMIN'), deleteVendor);

module.exports = router;
