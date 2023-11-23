const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
 client:String,
 event: String, 
 version: String,
 date: Date,
}, {
timestamps: true
});

module.exports = model('Event', eventSchema )