const { Schema, model } = require('mongoose');

const progressSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedLessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Modules',
    }],
  });

  module.exports = model('Progress', progressSchema);