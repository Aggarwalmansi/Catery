const prisma = require('../utils/prisma');

/**
 * Generate a random alphanumeric ticket ID (e.g., TKT-7X9B)
 */
const generateTicketId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TKT-${result}`;
};

/**
 * @desc    Create a new support query
 * @route   POST /api/queries
 * @access  Private
 */
const createQuery = async (req, res) => {
    try {
        const { type, subject, description } = req.body;

        if (!type || !subject || !description) {
            return res.status(400).json({ error: 'Please submit all required fields' });
        }

        const ticketId = generateTicketId();

        const query = await prisma.query.create({
            data: {
                userId: req.user.id,
                ticketId,
                type,
                subject,
                description,
                status: 'Pending'
            }
        });

        res.status(201).json(query);
    } catch (error) {
        console.error('Create Query Error:', error);
        res.status(500).json({ error: 'Failed to submit query. Please try again later.' });
    }
};

/**
 * @desc    Get logged-in user's queries
 * @route   GET /api/queries/my-queries
 * @access  Private
 */
const getMyQueries = async (req, res) => {
    try {
        const queries = await prisma.query.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(queries);
    } catch (error) {
        console.error('Get My Queries Error:', error);
        res.status(500).json({ error: 'Failed to fetch queries' });
    }
};

/**
 * @desc    Get all queries (Admin only)
 * @route   GET /api/queries
 * @access  Private/Admin
 */
const getAllQueries = async (req, res) => {
    try {
        const queries = await prisma.query.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        res.json(queries);
    } catch (error) {
        console.error('Get All Queries Error:', error);
        res.status(500).json({ error: 'Failed to fetch queries' });
    }
};

/**
 * @desc    Update query status and reply (Admin only)
 * @route   PATCH /api/queries/:id
 * @access  Private/Admin
 */
const updateQueryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminReply } = req.body;

        const query = await prisma.query.update({
            where: { id },
            data: {
                status: status || undefined,
                adminReply: adminReply || undefined
            }
        });

        res.json(query);
    } catch (error) {
        console.error('Update Query Error:', error);
        res.status(500).json({ error: 'Failed to update query status.' });
    }
};

module.exports = {
    createQuery,
    getMyQueries,
    getAllQueries,
    updateQueryStatus
};
