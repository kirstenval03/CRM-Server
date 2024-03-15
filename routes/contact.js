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
    .then((event) => {
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event.contacts);
    })
    .catch((err) => {
      console.error(err);
      next(err);
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
      console.error(err);
      next(err);
    });
});

// CREATE A NEW CONTACT FOR A SPECIFIC EVENT
router.post('/new-contact/:eventId', async (req, res, next) => {
  const { eventId } = req.params;
  const { firstName, lastName, email, phone, ticketRevenue, vip, source, country, state, notes, coachName, coachEmail, statusColor, columnId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      ticketRevenue,
      vip,
      source,
      country,
      state,
      pipelineStatus: 'Registrant', // Set default value for pipeline status
      notes,
      coachName,
      coachEmail,
      statusColor,
      columnId,
      event: { eventId: event._id, eventName: event.name }, // Reference the event
    });

    await newContact.save();

    // Push the new contact's ID to the event's contacts array
    event.contacts.push(newContact._id);
    await event.save();

    res.json(newContact);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// UPDATE CONTACT INFO
router.post('/contact-update/:eventId/:contactId', async (req, res, next) => {
  const { eventId, contactId } = req.params;
  const updatedContactData = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find the index of the contact within the event's contacts array
    const contactIndex = event.contacts.findIndex(contact => contact._id.toString() === contactId);
    if (contactIndex === -1) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update the contact's pipeline status if provided
    if (updatedContactData.pipelineStatus) {
      event.contacts[contactIndex].pipelineStatus = updatedContactData.pipelineStatus;
    }

    // Update other contact fields as needed
    event.contacts[contactIndex] = { ...event.contacts[contactIndex], ...updatedContactData };
    await event.save();

    // Respond with the updated contact
    res.json(event.contacts[contactIndex]);
  } catch (err) {
    console.error(err);
    next(err);
  }
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

// LIST ALL COACHES FOR A SPECIFIC EVENT
router.get('/coaches/:eventId', async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const coachesSet = new Set();
    event.contacts.forEach((contact) => {
      coachesSet.add(contact.coachName);
    });
    
    const coaches = [...coachesSet];
    res.json({ coaches });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



module.exports = router;