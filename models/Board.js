const { Schema, model } = require('mongoose');


const cardSchema = new Schema({
    contactId: [{ type: Schema.Types.ObjectId, ref: 'Contact' }], // Reference to Contact schema
});


// Define Column schema with a reference to Contact
const columnSchema = new Schema({
    title: String,
    position: Number,
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

// const { Schema, model } = require('mongoose');

// //COLUMNS
// const columnSchema = new Schema({
//     board: { type: Schema.Types.ObjectId, ref: 'Board' },
//     title: String,
//     position: Number,
// },{ timestamps: true });

// //CONTACTS / CARDS
// const cardSchema = new Schema({
//     eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, 
//     contactId: { type: Schema.Types.ObjectId, ref: 'Event.contacts' },
//     position: Number, 
//     column: { type: Schema.Types.ObjectId, ref: 'Column' }
// },{ timestamps: true });


// // BOARD
// const boardSchema = new Schema({
//     eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, 
//     columns: [columnSchema], 

// });


// const Board = model('Board', boardSchema);
// const Column = model('Column', columnSchema);
// const Card = model('Card', cardSchema);

// module.exports = {
//     Board,
//     Column,
//     Card,
// };
