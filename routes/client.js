var express = require('express');
var router = express.Router();

const { Client } = require('../models/Data'); // Import the new Client schema
const isAuthenticated = require('../middleware/isAuthenticated');

// DISPLAY ALL CLIENTS
router.get('/', (req, res, next) => {
  Client.find()
    .then((allClients) => {
      res.json(allClients);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// SEE CLIENT DETAILS
router.get('/client-detail/:clientId', (req, res, next) => {
  const { clientId } = req.params;

  Client.findById(clientId)
    .then((foundClient) => {
      if (!foundClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(foundClient);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// CREATE A NEW CLIENT
router.post('/new-client',  (req, res, next) => {
  console.log('Received POST request at /new-client');

  const { name, driveFolder, events } = req.body;

  Client.create({
    name,
    driveFolder,
    events,
  })
    .then((newClient) => {
      res.json(newClient);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// UPDATE CLIENT INFO
router.post('/client-update/:clientId', (req, res, next) => {
  const { clientId } = req.params;

  const { name, driveFolder} = req.body;

  Client.findByIdAndUpdate(
    clientId,
    {
      name,
      driveFolder,
    },
    { new: true }
  )
    .then((updatedClient) => {
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(updatedClient);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// DELETE CLIENT
router.delete('/delete-client/:clientId',  (req, res, next) => {
  const { clientId } = req.params;

  Client.findByIdAndDelete(clientId)
    .then((deletedClient) => {
      if (!deletedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json({ message: 'Client deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;