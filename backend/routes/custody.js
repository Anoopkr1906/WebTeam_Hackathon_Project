const express = require('express');
const router = express.Router();
const CustodyLog = require('../models/CustodyLog');
const Property = require('../models/Property');
const Case = require('../models/Case'); // Optional if we need to check case status

// @route   POST /api/custody
// @desc    Record a new movement (Chain of Custody)
// @access  Private (Police)
router.post('/', async (req, res) => {
    try {
        const { propertyId, caseId, toLocation, toOfficer, action, remarks, fromLocation, fromOfficer } = req.body;

        // 1. Create Log Entry
        const newLog = new CustodyLog({
            propertyId,
            caseId,
            fromLocation,
            fromOfficer,
            toLocation,
            toOfficer,
            action,
            remarks
        });

        await newLog.save();

        // 2. Update Property Current Location & Status
        let updateFields = { location: toLocation };

        if (action === 'CHECKOUT') {
            updateFields.status = 'CUSTODY'; // e.g., Out with officer
        } else if (action === 'CHECKIN' || action === 'TRANSFER') {
            updateFields.status = 'SEIZED'; // Back in storage (simplified logic)
        }

        await Property.findByIdAndUpdate(propertyId, updateFields);

        res.json(newLog);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
