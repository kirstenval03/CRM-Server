const { Schema, model } = require('mongoose');

// Define Board schema with references to Column and Task
const boardSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User schema
    columns: [columnSchema], // Array of columns
});

// Define Task schema
const taskSchema = new Schema({
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    indexPosition: Number,
});

// Define Column schema with a reference to Task
const columnSchema = new Schema({
    title: String,
    taskIds: [{ type: Schema.Types.ObjectId, ref: 'Task' }], // Reference to Task schema
    indexPosition: Number,
});

const Board = model('Board', boardSchema);
const Column = model('Column', columnSchema);
const Task = model('Task', taskSchema);

module.exports = {
    Board,
    Column,
    Task,
};