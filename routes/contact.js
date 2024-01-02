const express = require('express');
const router = express.Router();

const { Contact } = require('../models/Data'); // Import the new Contact schema
const { fetchAndSaveContactData } = require('../services/gsWTB'); // Import the Google Sheets service

// IMPORT CONTACTS FROM GOOGLE-SHEETS
router.get('/import-from-google-sheets', async (req, res) => {
  try {
    await fetchAndSaveContactData();
    res.send('Contact data import initiated');
  } catch (error) {
    console.error('Error importing contact data:', error);
    res.status(500).send('Error importing contact data.');
  }
});

// LIST ALL CONTACTS
router.get('/', (req, res, next) => {
  Contact.find()
    .then((allContacts) => {
      res.json(allContacts);
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
      console.log(err);
      next(err);
    });
});

// CREATE A NEW CONTACT
router.post('/new-contact', (req, res, next) => {
  const { name, email, phone, source, leadOrRegistrant, assignedTo, statusColor, columnId } = req.body;

  Contact.create({
    name,
    email,
    phone,
    source,
    leadOrRegistrant,
    assignedTo,
    statusColor,
    columnId,
  })
    .then((newContact) => {
      res.json(newContact);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
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
