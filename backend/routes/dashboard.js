const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
// const Property = require('../models/Property'); // Uncomment when needed

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Police/User)
router.get('/stats', async (req, res) => {
    try {
        const totalCases = await Case.countDocuments();
        const pendingCases = await Case.countDocuments({ status: 'PENDING' });
        const disposedCases = await Case.countDocuments({ status: 'CLOSED' });

        // Mock recent activity for now
        const recentActivity = await Case.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalCases,
            pendingCases,
            disposedCases,
            recentActivity
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
