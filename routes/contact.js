const express = require('express');
const router = express.Router();

const { Contact, Event } = require('../models/Data'); // Updated model imports
const { fetchAndSaveContactData } = require('../services/gsWTB'); // Import the Google Sheets service

// IMPORT CONTACTS FROM GOOGLE-SHEETS FOR A SPECIFIC EVENT
router.get('/import-from-google-sheets/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    await fetchAndSaveContactData(eventId);
    res.send('Contact data import initiated');
  } catch (error) {
    console.error('Error importing contact data:', error);
    res.status(500).send('Error importing contact data.');
  }
});

// LIST ALL CONTACTS FOR A SPECIFIC EVENT
router.get('/:eventId', (req, res, next) => {
  const { eventId } = req.params;

  Event.findById(eventId)
    .populate('contacts')
    .exec((err, event) => {
      if (err) {
        console.error(err);
        next(err);
      } else {
        if (!event) {
          return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event.contacts);
      }
    });
});

// VIEW CONTACT DETAILS
router.get('/contact-detail/:contactId', (req, res, next) => {
  const { contactId } = req.params;

  Contact.findById(contactId)
    .then((foundContact) => {
      if (!foundContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(foundContact);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// CREATE A NEW CONTACT FOR A SPECIFIC EVENT
router.post('/new-contact/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  const { name, email, phone, source, leadOrRegistrant, assignedTo, statusColor, columnId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      source,
      leadOrRegistrant,
      assignedTo,
      statusColor,
      columnId,
      event: { eventId: event._id, eventName: event.name }, // Reference the event
    });

    await newContact.save();
    res.json(newContact);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// UPDATE CONTACT INFO
router.post('/contact-update/:contactId', (req, res, next) => {
  const { contactId } = req.params;

  const { name, email, phone, source, leadOrRegistrant, assignedTo, statusColor, columnId } = req.body;

  Contact.findByIdAndUpdate(
    contactId,
    {
      name,
      email,
      phone,
      source,
      leadOrRegistrant,
      assignedTo,
      statusColor,
      columnId,
    },
    { new: true }
  )
    .then((updatedContact) => {
      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(updatedContact);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// DELETE CONTACT
router.delete('/delete-contact/:contactId', (req, res, next) => {
  const { contactId } = req.params;

  Contact.findByIdAndDelete(contactId)
    .then((deletedContact) => {
      if (!deletedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json({ message: 'Contact deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
