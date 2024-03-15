const { Schema, model } = require('mongoose');

// Define Column schema with a reference to Contact
const columnSchema = new Schema({
    title: String,
    contacts: [{ type: Schema.Types.ObjectId, ref: 'Contact' }], // Reference to Contact schema
    indexPosition: Number,
});

// Define Board schema with references to Column and Event
const boardSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, 
    eventName: { type: Schema.Types.ObjectId, ref: 'Event' }, // Reference to Event schema
    columns: [columnSchema], // Array of columns
});

const Board = model('Board', boardSchema);
const Column = model('Column', columnSchema);

module.exports = {
    Board,
    Column,
};
