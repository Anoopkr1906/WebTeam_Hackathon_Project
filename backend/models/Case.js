const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        required: true,
        unique: true
    },
    crimeNumber: {
        type: String,
        required: true
    },
    crimeYear: {
        type: Number,
        required: true
    },
    stationName: {
        type: String,
        required: true
    },
    investigatingOfficer: {
        type: String,
        required: true
    },
    officerId: {
        type: String,
        required: true
    },
    dateOfFIR: {
        type: Date,
        required: true
    },
    dateOfSeizure: {
        type: Date,
        required: true
    },
    actSection: String,
    lawSection: String,
    status: {
        type: String,
        enum: ['PENDING', 'CLOSED'],
        default: 'PENDING'
    },
    disposalDetails: {
        type: { type: String }, // 'RETURNED', 'DESTROYED', etc.
        orderRef: String,
        date: Date,
        remarks: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
