var express = require('express');
var router = express.Router();

const { Event, Client } = require('../models/Data'); // Import both Event and Client schemas

// DISPLAY ALL EVENTS
router.get('/', (req, res, next) => {
  Event.find()
    .then(allEvents => res.json(allEvents))
    .catch(err => {
      console.error(err);
      next(err);
    });
});

// SEE EVENT DETAILS
router.get('/event-detail/:eventId', (req, res, next) => {
  const { eventId } = req.params;

  Event.findById(eventId)
    .then(foundEvent => {
      if (!foundEvent) {
        return res.status(404).send('Event not found');
      }
      res.json(foundEvent);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});


// CREATE A NEW EVENT
router.post('/new-event', async (req, res, next) => {
    try {
      const { name, initials, edition, date, driveFolder, active, coaches, clientId, clientName } = req.body;
  
      // Create the event
      const newEvent = new Event({
        client: { clientId, clientName }, // Include the client field
        name,
        initials,
        edition,
        date,
        driveFolder,
        active,
        coaches,
      });
  
      const savedEvent = await newEvent.save();
  
      // Find the client by clientId
      const client = await Client.findById(clientId);
  
      if (!client) {
        return res.status(404).send('Client not found');
      }
  
      // Push the event's ObjectId into the client's events array
      client.events.push(savedEvent._id);
  
      // Save the updated client
      await client.save();
  
      res.status(201).json(savedEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      next(error);
    }
  });
  
  

// UPDATE EVENT INFO
router.post('/event-update/:eventId', (req, res, next) => {
  const { eventId } = req.params;
  const { name, initials, edition, date, driveFolder, active, coaches } = req.body;

  Event.findByIdAndUpdate(eventId, { name, initials, edition, date, driveFolder, active, coaches }, { new: true })
    .then(updatedEvent => res.json(updatedEvent))
    .catch(err => {
      console.log(err);
      next(err);
    });
});

// DELETE EVENT
router.post('/delete-event/:eventId', (req, res, next) => {
  const { eventId } = req.params;

  Event.findByIdAndDelete(eventId)
    .then(deletedEvent => res.json(deletedEvent))
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;

