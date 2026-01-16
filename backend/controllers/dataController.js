const prisma = require('../utils/prisma');

const getOccasions = async (req, res) => {
    try {
        const occasions = await prisma.occasion.findMany();
        res.json(occasions);
    } catch (error) {
        console.error('Fetch Occasions Error:', error);
        res.status(500).json({ error: 'Failed to retrieve event occasions.' });
    }
};

const getVendors = async (req, res) => {
    try {
        const { occasion } = req.query;
        let query = {
            isVerified: true,
            status: { not: 'DISABLED' }
        };

        if (occasion) {
            query.occasions = {
                has: occasion,
            };
        }

        const vendors = await prisma.vendor.findMany({
            where: query,
            include: {
                menuItems: true,
                packages: true,
            },
        });

        res.json(vendors);
    } catch (error) {
        console.error('Fetch Vendors Error:', error);
        res.status(500).json({ error: 'Failed to retrieve vendor listings.' });
    }
};

const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await prisma.vendor.findUnique({
            where: { id },
            include: {
                menuItems: true,
            },
        });

        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Public protection (Only verified and non-disabled)
        // Bypass if user is ADMIN or the vendor themselves? 
        // For simplicity, let's just use it as public endpoint.
        const isAdmin = req.user?.role === 'ADMIN';
        const isOwner = req.user?.id === vendor.userId;

        if (!vendor.isVerified && !isAdmin && !isOwner) {
            return res.status(404).json({ error: 'Vendor not yet approved' });
        }
        if (vendor.status === 'DISABLED' && !isAdmin && !isOwner) {
            return res.status(404).json({ error: 'Vendor is currently disabled' });
        }

        res.json(vendor);
    } catch (error) {
        console.error('Fetch Vendor Detail Error:', error);
        res.status(500).json({ error: 'Failed to retrieve vendor information.' });
    }
};

const getVendorPackages = async (req, res) => {
    try {
        const { id } = req.params;
        const packages = await prisma.package.findMany({
            where: { vendorId: id },
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

module.exports = { getOccasions, getVendors, getVendorById, getVendorPackages };
