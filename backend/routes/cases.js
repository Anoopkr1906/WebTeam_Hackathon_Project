const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Property = require('../models/Property');
const CustodyLog = require('../models/CustodyLog');
const { upload } = require('../config/cloudinary');
const QRCode = require('qrcode');
const auth = require('../middlewares/auth');

// @route   POST /api/cases
// @desc    Create a new case and add initial property
// @access  Private (Police only)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // 1. Extract Data
        const {
            crimeNumber,
            crimeYear,
            stationName,
            investigatingOfficer,
            officerId,
            dateOfFIR,
            dateOfSeizure,
            actSection,
            lawSection,
            description,
            // Property Data
            propertyCategory,
            propertyBelongingTo,
            propertyDescription,
            propertyLocation,
            propertyQuantity,
            propertyNature
        } = req.body;

        // Generate a simple Case ID
        const generatedCaseId = `CASE-${crimeYear}-${crimeNumber}`;

        let newCase = new Case({
            caseId: generatedCaseId,
            crimeNumber,
            crimeYear,
            stationName,
            investigatingOfficer,
            officerId,
            dateOfFIR,
            dateOfSeizure,
            actSection,
            lawSection,
            status: 'PENDING'
        });

        const savedCase = await newCase.save();

        // 3. Handle Property
        let photoPath = '';
        if (req.file) {
            photoPath = req.file.path; // Cloudinary URL
        }

        const newProperty = new Property({
            caseId: savedCase._id,
            category: propertyCategory,
            belongingTo: propertyBelongingTo,
            nature: propertyNature,
            quantity: propertyQuantity,
            location: propertyLocation,
            description: propertyDescription,
            photoPath: photoPath,
            status: 'SEIZED'
        });

        const savedProperty = await newProperty.save();

        // 4. Generate QR Code containing Property ID and Case ID
        const qrData = JSON.stringify({
            pId: savedProperty._id,
            cId: savedCase.caseId
        });

        const qrCodeUrl = await QRCode.toDataURL(qrData);
        savedProperty.qrCodeData = qrCodeUrl;
        await savedProperty.save();

        // 5. Create Initial Custody Log
        const newLog = new CustodyLog({
            propertyId: savedProperty._id,
            caseId: savedCase._id,
            fromLocation: 'SEIZURE',
            fromOfficer: 'SEIZURE',
            toLocation: propertyLocation,
            toOfficer: investigatingOfficer,
            action: 'SEIZURE',
            remarks: 'Initial seizure and entry into Malkhana'
        });

        await newLog.save();

        res.status(201).json({
            message: 'Case and Property Created Successfully',
            case: savedCase,
            property: savedProperty,
            qrCode: qrCodeUrl
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/cases/:id/properties
// @desc    Add a NEW property to an existing case
// @access  Private (Police only)
router.post('/:id/properties', upload.single('image'), async (req, res) => {
    try {
        const caseItem = await Case.findOne({ caseId: req.params.id });
        if (!caseItem) {
            return res.status(404).json({ message: 'Case not found' });
        }

        const {
            category,
            belongingTo,
            nature,
            quantity,
            location,
            description
        } = req.body;

        let photoPath = '';
        if (req.file) {
            photoPath = req.file.path;
        }

        const newProperty = new Property({
            caseId: caseItem._id,
            category,
            belongingTo,
            nature,
            quantity,
            location,
            description,
            photoPath,
            status: 'SEIZED'
        });

        const savedProperty = await newProperty.save();

        const qrData = JSON.stringify({
            pId: savedProperty._id,
            cId: caseItem.caseId
        });
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        savedProperty.qrCodeData = qrCodeUrl;
        await savedProperty.save();

        // Log Initial Seizure for this new property
        const newLog = new CustodyLog({
            propertyId: savedProperty._id,
            caseId: caseItem._id,
            fromLocation: 'SEIZURE',
            fromOfficer: 'SUBSEQUENT_ENTRY',
            toLocation: location,
            toOfficer: caseItem.investigatingOfficer,
            action: 'SEIZURE',
            remarks: 'Additional property added to case'
        });
        await newLog.save();

        res.json({
            message: 'Property Added',
            property: savedProperty,
            qrCode: qrCodeUrl
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/cases
// @desc    Get all cases (with filters)
router.get('/', async (req, res) => {
    try {
        const { stationName, crimeYear, status } = req.query;
        let query = {};

        if (stationName) query.stationName = new RegExp(stationName, 'i');
        if (crimeYear) query.crimeYear = crimeYear;
        if (status) query.status = status;

        const cases = await Case.find(query).sort({ createdAt: -1 });
        res.json(cases);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/cases/:id
// @desc    Get single case by caseId with ALL properties
router.get('/:id', async (req, res) => {
    try {
        const caseItem = await Case.findOne({ caseId: req.params.id });
        if (!caseItem) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Changed findOne to find to get ALL properties
        const properties = await Property.find({ caseId: caseItem._id });
        const logs = await CustodyLog.find({ caseId: caseItem._id }).sort({ timestamp: -1 });

        res.json({
            case: caseItem,
            properties, // Return array now
            logs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/cases/:id/status
// @desc    Update case status (e.g. to CLOSED)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const caseItem = await Case.findOne({ caseId: req.params.id });

        if (!caseItem) {
            return res.status(404).json({ message: 'Case not found' });
        }

        caseItem.status = status;
        await caseItem.save();

        res.json(caseItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
