const { Schema, model } = require('mongoose');

const leadSchema = new Schema({
    name: String,
    email: String,
    coachName: String,
    coachEmail: String, 
    statusColor: {
        type: String,
        enum: ['yellow', 'green', 'red', ''], 
        default: ''
    }
}, {
    timestamps: true
});

module.exports = model('Lead', leadSchema);