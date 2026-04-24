const mongoose = require('mongoose');

const processedRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h' // TTL index for automatic cleanup
    }
});

module.exports = mongoose.model('ProcessedRequest', processedRequestSchema);
