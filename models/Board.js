const { Schema, model } = require('mongoose');


const cardSchema = new Schema({
    contactId: [{ type: Schema.Types.ObjectId, ref: 'Contact' }], // Reference to Contact schema
});


// Define Column schema with a reference to Contact
const columnSchema = new Schema({
    title: String,
    indexPosition: Number,
    cards: [cardSchema],
});

// Define Board schema with references to Column and Event
const boardSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, 
    columns: [columnSchema], // Array of columns
});


const Board = model('Board', boardSchema);
const Column = model('Column', columnSchema);
const Card = model('Card', cardSchema);

module.exports = {
    Board,
    Column,
    Card,
};
