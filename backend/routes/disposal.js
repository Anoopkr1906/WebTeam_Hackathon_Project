const express = require('express');
const router = express.Router();
const DisposalRecord = require('../models/DisposalRecord');
const CustodyLog = require('../models/CustodyLog');
const Property = require('../models/Property');
const Case = require('../models/Case');

// @route   POST /api/disposal
// @desc    Dispose a property and close case if needed
// @access  Private (Police)
router.post('/', async (req, res) => {
    try {
        const { propertyId, caseId, disposalType, courtOrderRef, remarks, authorisedBy } = req.body;

        // 1. Create Disposal Record
        const newDisposal = new DisposalRecord({
            propertyId,
            caseId,
            disposalType,
            courtOrderRef,
            remarks,
            authorisedBy
        });
        await newDisposal.save();

        // 2. Update Property Status
        await Property.findByIdAndUpdate(propertyId, {
            status: 'DISPOSED',
            location: 'DISPOSED'
        });

        // 3. Create Final Custody Log
        const newLog = new CustodyLog({
            propertyId,
            caseId,
            fromLocation: 'STORAGE', // Assuming form provides this or we fetch current
            fromOfficer: authorisedBy,
            toLocation: 'DISPOSED',
            toOfficer: 'N/A',
            action: 'DISPOSAL',
            remarks: `Disposed via ${disposalType}. Order: ${courtOrderRef}`
        });
        await newLog.save();

        // 4. Update Case Status to CLOSED (Assumption: 1 property per case for this prototype, or check if all properties disposed)
        await Case.findByIdAndUpdate(caseId, {
            status: 'CLOSED',
            disposalDetails: {
                type: disposalType,
                orderRef: courtOrderRef,
                date: Date.now(),
                remarks
            }
        });

        res.json({ message: 'Property Disposed and Case Closed', disposal: newDisposal });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
