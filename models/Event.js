const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    client: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: String,
}, {
    timestamps: true
});

// Optional: Index for improved query performance
eventSchema.index({ startDate: 1, endDate: 1 });

module.exports = model('Event', eventSchema);

