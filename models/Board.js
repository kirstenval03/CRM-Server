const { Schema, model } = require('mongoose');

// Define Task schema
const taskSchema = new Schema({
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' }, // Reference to the Contact schema
    indexPosition: Number,
});

// Define Column schema with a reference to Task
const columnSchema = new Schema({
    title: String,
    tasks: [taskSchema], // Reference to Task schema
    indexPosition: Number,
});

// Define Board schema with references to Column and Task
const boardSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, 
    eventName: { type: Schema.Types.ObjectId, ref: 'Event' }, // Reference to Event schema
    columns: [columnSchema], // Array of columns
});

const Board = model('Board', boardSchema);
const Column = model('Column', columnSchema);
const Task = model('Task', taskSchema);

module.exports = {
    Board,
    Column,
    Task,
};
