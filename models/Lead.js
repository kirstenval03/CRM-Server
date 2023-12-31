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
    },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column' } // Reference to the column
}, {
    timestamps: true
});

module.exports = model('Lead', leadSchema);
