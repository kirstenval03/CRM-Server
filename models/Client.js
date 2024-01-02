const { Schema, model } = require('mongoose');

const clientSchema = new Schema({
    name: String,
    driveFolder: String,
    events: [eventSchema],
}, 
{
timestamps: true
}
)

module.exports = model('Client', clientSchema)