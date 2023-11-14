const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
 client:String,
 event: String, 
 date: Date,
}, {
timestamps: true
});

module.exports = model('Event', eventSchema )