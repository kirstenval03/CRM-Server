// const { Schema, model } = require('mongoose');

// const contactSchema = new Schema({
//     name: String,
//     lastName: String,
//     email: String,
//     phone: String,
//     address: String,
//     Source: String,
//     assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//     statusColor: [
//       {
//         type: String,
//         enum: ['yellow', 'green', 'red', ''],
//         default: '',
//       },
//     ],
//     columnId: { type: Schema.Types.ObjectId, ref: 'Column' },
//   });


// module.exports = model('Contact', contactSchema)