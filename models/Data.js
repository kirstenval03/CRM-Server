const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from Mongoose


const contactSchema = new Schema({ 
  event: {
      eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, // Reference the 'Event' model
      eventName: { type: Schema.Types.ObjectId, ref: 'Event' }, // Reference the 'Event' model for event name
  },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  ticketRevenue: Number,
  vip: String,
  source: String,
  country: String,
  state: String,
  coachName: String,
  coachEmail: String,
  pipelineStatus: String,
  notes: String,
  statusColor: [{
      type: String,
      enum: ['yellow', 'green', 'red', ''],
      default: '',
  }],
});


const eventSchema = new Schema({
    client: {
        clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
        clientName: String,
    },
    name: String,
    initials: String,
    edition: Number,
    date: Date,
    driveFolder: String,
    active: Boolean,
    spreadsheetID: String, 
    coaches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    contacts: [contactSchema], 
    eventLinks: [
      {
          title: String,
          link: String
      }
  ]
});

const clientSchema = new Schema({
    name: String,
    driveFolder: String,
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'Event',
    }],
  });

const Contact = mongoose.model('Contact', contactSchema);
const Event = mongoose.model('Event', eventSchema);
const Client = mongoose.model('Client', clientSchema);

module.exports = {
  Contact,
  Event,
  Client,
};
