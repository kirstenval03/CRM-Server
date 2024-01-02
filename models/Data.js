const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from Mongoose

const contactSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  source: String,
  leadOrRegistrant: String,
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  statusColor: [
    {
      type: String,
      enum: ['yellow', 'green', 'red', ''],
      default: '',
    },
  ],
  columnId: { type: Schema.Types.ObjectId, ref: 'Column' },
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
    coaches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    contacts: [contactSchema], // Embed contacts within events
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
