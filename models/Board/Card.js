const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
    name: String,
    email: String,
    coachName: String,
    coachEmail: String,
    statusColor: {
        type: String,
        enum: ['yellow', 'green', 'red', ''],
        default: ''
    },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column' },
    description: String, 
    position: Number // Add position field for card order within a column
}, {
    timestamps: true
});

module.exports = model('Card', cardSchema);
