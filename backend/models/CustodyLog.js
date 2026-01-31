const mongoose = require('mongoose');

const custodyLogSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    caseId: {
        type: mongoose.Schema.Types.ObjectId, // Or String if you prefer using the textual caseId
        ref: 'Case',
        required: true
    },
    fromLocation: String,
    fromOfficer: String,
    toLocation: String,
    toOfficer: String,
    action: {
        type: String,
        enum: ['SEIZURE', 'TRANSFER', 'CHECKIN', 'CHECKOUT', 'DISPOSAL'],
        required: true
    },
    remarks: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CustodyLog', custodyLogSchema);
