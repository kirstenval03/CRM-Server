// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const contactSchema = new Schema({
//   event: {
//     eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
//     eventName: { type: Schema.Types.ObjectId, ref: 'Event' },
//   },
//   firstName: String,
//   lastName: String,
//   email: String,
//   phone: String,
//   ticketRevenue: Number,
//   vip: String,
//   source: String,
//   country: String,
//   state: String,
//   coachName: String,
//   coachEmail: String,
//   pipelineStatus: {
//     type: String,
//     enum: [
//       'Registrant',
//       '1st Call Booked',
//       '1st Call Taken',
//       '2nd Call Booked',
//       '2nd Call Taken',
//       'Applied',
//       'Lost',
//       'Working-post-call',
//       'Deposit',
//       'Enrolled',
//       'Declined/Not Qualified',
//       'No Show/No Longer Interested'
//     ],
//     default: 'Registrant',
//   },
//   notes: String,
//   statusColor: [{
//     type: String,
//     enum: ['yellow', 'green', 'red', ''],
//     default: '',
//   }],
// });

// module.exports = mongoose.model('Contact', contactSchema);