const prisma = require('../utils/prisma');

// @desc    Onboard as a vendor (Create Vendor Profile)
// @route   POST /api/vendor/onboard
// @access  Private (User)
const createVendorProfile = async (req, res) => {
    try {
        const { name, description, email, phone, address, occasions, image } = req.body;
        const userId = req.user.id;

        // Check if user already has a vendor profile
        const existingVendor = await prisma.vendor.findUnique({
            where: { userId },
        });

        if (existingVendor) {
            return res.status(400).json({ error: 'Vendor profile already exists for this user' });
        }

        // Check if vendor email is taken (by another vendor)
        const emailTaken = await prisma.vendor.findUnique({ where: { email } });
        if (emailTaken) {
            return res.status(400).json({ error: 'Email already used by another vendor' });
        }

        const vendor = await prisma.vendor.create({
            data: {
                userId,
                name,
                description,
                email,
                phone,
                address,
                occasions: occasions || [],
                image,
                isVerified: false, // Must be verified by admin
            },
        });

        // Update user role to VENDOR
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: 'VENDOR' },
        });

        // Generate new token with updated role
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: updatedUser.id, role: updatedUser.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Vendor profile created',
            vendor,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create vendor profile' });
    }
};

// @desc    Get current vendor profile
// @route   GET /api/vendor/me
// @access  Private (Vendor)
const getMyVendorProfile = async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.id },
            include: { menuItems: true },
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor profile not found' });
        }

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update vendor profile
// @route   PUT /api/vendor/me
// @access  Private (Vendor)
const updateVendorProfile = async (req, res) => {
    try {
        const { name, description, phone, address, occasions, image } = req.body;

        const vendor = await prisma.vendor.update({
            where: { userId: req.user.id },
            data: {
                name,
                description,
                phone,
                address,
                occasions,
                image,
            },
        });

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// @desc    Toggle Vendor Status (ACTIVE/PAUSED)
// @route   PATCH /api/vendor/me/status
// @access  Private (Vendor)
const toggleVendorStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['ACTIVE', 'PAUSED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be ACTIVE or PAUSED' });
        }

        const vendor = await prisma.vendor.update({
            where: { userId: req.user.id },
            data: { status },
        });

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to toggle status' });
    }
};

// @desc    Add Menu Item
// @route   POST /api/vendor/menu
// @access  Private (Vendor)
const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, isVeg } = req.body;

        // Find vendor id from user id
        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.id },
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor profile not found' });
        }

        const menuItem = await prisma.menuItem.create({
            data: {
                vendorId: vendor.id,
                name,
                description,
                price: parseFloat(price),
                category,
                isVeg: isVeg === undefined ? true : isVeg,
            },
        });

        res.status(201).json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add menu item' });
    }
};

// @desc    Update Menu Item
// @route   PUT /api/vendor/menu/:id
// @access  Private (Vendor)
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, isVeg } = req.body;

        // Verify ownership
        const menuItem = await prisma.menuItem.findUnique({ where: { id } });
        if (!menuItem) return res.status(404).json({ error: 'Item not found' });

        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
        if (menuItem.vendorId !== vendor.id) {
            return res.status(403).json({ error: 'Not authorized to update this item' });
        }

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                isVeg,
            },
        });

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
};

// @desc    Delete Menu Item
// @route   DELETE /api/vendor/menu/:id
// @access  Private (Vendor)
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership
        const menuItem = await prisma.menuItem.findUnique({ where: { id } });
        if (!menuItem) return res.status(404).json({ error: 'Item not found' });

        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
        if (menuItem.vendorId !== vendor.id) {
            return res.status(403).json({ error: 'Not authorized to delete this item' });
        }

        await prisma.menuItem.delete({ where: { id } });

        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

// @desc    Get All Vendors (Admin)
// @route   GET /api/vendor/admin/all
// @access  Private (Admin)
const getAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany({
            include: { menuItems: true }, // Optional
            orderBy: { createdAt: 'desc' }
        });
        res.json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Verify/Reject Vendor
// @route   PATCH /api/vendor/admin/:id/verify
// @access  Private (Admin)
const verifyVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const vendor = await prisma.vendor.update({
            where: { id },
            data: {
                isVerified,
                // If verified, ensure status is ACTIVE if it was DISABLED
                status: isVerified ? 'ACTIVE' : undefined
            },
        });

        if (isVerified) {
            await prisma.user.update({
                where: { id: vendor.userId },
                data: { role: 'VENDOR' }
            });
        }

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/vendor/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalCaterers = await prisma.vendor.count();
        const pendingApprovals = await prisma.vendor.count({ where: { isVerified: false } });
        const liveCaterers = await prisma.vendor.count({
            where: { isVerified: true, status: { not: 'DISABLED' } }
        });
        const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        const totalBookings = await prisma.booking.count();

        // Revenue calculation (ONLY approved, payment-paid, confirmed, or completed)
        const revenueData = await prisma.booking.aggregate({
            where: { status: { in: ['APPROVED', 'ADVANCE_PAID', 'CONFIRMED', 'COMPLETED'] } },
            _sum: { totalAmount: true }
        });

        res.json({
            totalCaterers,
            pendingApprovals,
            liveCaterers,
            totalUsers,
            totalBookings,
            revenue: revenueData._sum.totalAmount || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

// @desc    Admin: Change Vendor Status (e.g. DISABLE)
// @route   PATCH /api/vendor/admin/:id/status
// @access  Private (Admin)
const getVendorStats = async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.id }
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const totalOrders = await prisma.booking.count({
            where: { vendorId: vendor.id }
        });

        const pendingOrders = await prisma.booking.count({
            where: { vendorId: vendor.id, status: 'PENDING' }
        });

        const revenueData = await prisma.booking.aggregate({
            where: {
                vendorId: vendor.id,
                status: { in: ['APPROVED', 'ADVANCE_PAID', 'CONFIRMED', 'COMPLETED'] }
            },
            _sum: { totalAmount: true }
        });

        res.json({
            totalOrders,
            pendingOrders,
            revenue: revenueData._sum.totalAmount || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vendor stats' });
    }
};

const adminUpdateVendorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['ACTIVE', 'PAUSED', 'DISABLED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const vendor = await prisma.vendor.update({
            where: { id },
            data: {
                status,
                // If disabled, maybe we also un-verify? Let's keep isVerified separate for now.
            },
        });

        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update vendor status' });
    }
};

// @desc    Delete Vendor Profile (Admin)
// @route   DELETE /api/vendor/admin/:id
// @access  Private (Admin)
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await prisma.vendor.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

        // Execute deletion of all related data in a transaction
        await prisma.$transaction([
            // Delete dependencies first
            prisma.booking.deleteMany({ where: { vendorId: id } }),
            prisma.package.deleteMany({ where: { vendorId: id } }),
            prisma.menuItem.deleteMany({ where: { vendorId: id } }),
            // Delete vendor profile
            prisma.vendor.delete({ where: { id } }),
            // Revert user role back to CUSTOMER
            prisma.user.update({
                where: { id: vendor.userId },
                data: { role: 'CUSTOMER' }
            })
        ]);

        res.json({ message: 'Vendor profile and all related data deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

// @desc    Create Package
// @route   POST /api/vendor/packages
// @access  Private (Vendor)
const createPackage = async (req, res) => {
    try {
        const { name, description, price, minPlates, items } = req.body; // items = ["itemId1", "itemId2"]

        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.id },
        });

        if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

        // Verify all items belong to this vendor (optional security check)
        // ...

        const newPackage = await prisma.package.create({
            data: {
                vendorId: vendor.id,
                name,
                description,
                price: parseFloat(price),
                minPlates: parseInt(minPlates) || 50,
                items: {
                    create: items && items.map(itemId => ({
                        menuItem: { connect: { id: itemId } }
                    }))
                }
            },
            include: {
                items: { include: { menuItem: true } }
            }
        });

        res.status(201).json(newPackage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create package' });
    }
};

// @desc    Get Packages
// @route   GET /api/vendor/packages
// @access  Private (Vendor)
const getPackages = async (req, res) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.id },
        });

        if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

        const packages = await prisma.package.findMany({
            where: { vendorId: vendor.id },
            include: {
                items: {
                    include: { menuItem: true }
                }
            }
        });

        res.json(packages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch packages' });
    }
};

// @desc    Update Package
// @route   PUT /api/vendor/packages/:id
// @access  Private (Vendor)
const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, minPlates, items } = req.body;

        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
        const pkg = await prisma.package.findUnique({ where: { id } });

        if (!pkg || pkg.vendorId !== vendor.id) {
            return res.status(403).json({ error: 'Not authorized or package not found' });
        }

        // Transactional update if items are changing
        // Simple approach: Update logic
        let updateData = {
            name,
            description,
            price: parseFloat(price),
            minPlates: parseInt(minPlates),
        };

        if (items) {
            // Delete existing relations first if we are replacing them
            // Ideally we should use a transaction, but for this simplified flow:
            await prisma.packageItem.deleteMany({
                where: { packageId: id }
            });

            updateData.items = {
                create: items.map(itemId => ({
                    menuItem: { connect: { id: itemId } }
                }))
            };
        }

        const updatedPackage = await prisma.package.update({
            where: { id },
            data: updateData,
            include: { items: { include: { menuItem: true } } }
        });

        res.json(updatedPackage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update package' });
    }
};

// @desc    Delete Package
// @route   DELETE /api/vendor/packages/:id
// @access  Private (Vendor)
const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
        const pkg = await prisma.package.findUnique({ where: { id } });

        if (!pkg || pkg.vendorId !== vendor.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await prisma.package.delete({ where: { id } });
        res.json({ message: 'Package deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete package' });
    }
};

module.exports = {
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
};
