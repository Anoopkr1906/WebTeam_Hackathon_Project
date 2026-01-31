const mongoose = require('mongoose');

const disposalRecordSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    disposalType: {
        type: String,
        enum: ['RETURNED', 'DESTROYED', 'AUCTIONED', 'COURT_CUSTODY', 'OTHER'],
        required: true
    },
    courtOrderRef: String,
    remarks: String,
    authorisedBy: String, // Officer Name/ID
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DisposalRecord', disposalRecordSchema);
