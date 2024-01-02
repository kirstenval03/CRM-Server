var express = require('express');
var router = express.Router();

const { Event } = require('../models/Data'); // Import the new Event schema

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
router.post('/new-event', (req, res, next) => {
  const { name, initials, edition, date, driveFolder, currentPhase, coaches } = req.body;

  Event.create({ name, initials, edition, date, driveFolder, currentPhase, coaches })
    .then(newEvent => res.json(newEvent))
    .catch(err => {
      console.log(err);
      next(err);
    });
});

// UPDATE EVENT INFO
router.post('/event-update/:eventId', (req, res, next) => {
  const { eventId } = req.params;
  const { name, initials, edition, date, driveFolder, currentPhase, coaches } = req.body;

  Event.findByIdAndUpdate(eventId, { name, initials, edition, date, driveFolder, currentPhase, coaches }, { new: true })
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
