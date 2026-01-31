const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    belongingTo: {
        type: String,
        enum: ['ACCUSED', 'COMPLAINANT', 'UNKNOWN'],
        required: true
    },
    nature: String,
    quantity: String,
    location: {
        type: String, // Rack/Room/Locker ID
        required: true
    },
    description: String,
    photoPath: String, // Cloudinary URL
    qrCodeData: String,
    status: {
        type: String,
        enum: ['SEIZED', 'CUSTODY', 'DISPOSED'],
        default: 'SEIZED'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
