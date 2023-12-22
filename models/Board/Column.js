const { Schema, model } = require('mongoose');

const columnSchema = new Schema({
    title: String,
    cardIds: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    position: Number, 
});

module.exports = model('Column', columnSchema);
