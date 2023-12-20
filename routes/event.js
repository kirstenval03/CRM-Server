var express = require('express');
var router = express.Router();

const Event = require('../models/Event');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require("../middleware/isAdmin"); // Ensure this matches the actual file name

// DISPLAY ALL EVENTS
router.get('/', (req, res, next) => {
    Event.find()
        .populate('client') // Populate client details
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
        .populate('client') // Populate client details
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
router.post('/new-event',(req, res, next) => {
    const { client, name, startDate, endDate, description } = req.body;

    Event.create({ client, name, startDate, endDate, description })
        .then(newEvent => res.json(newEvent))
        .catch(err => {
            console.log(err);
            next(err);
        });
});

// UPDATE EVENT INFO
router.post('/event-update/:eventId', isAuthenticated, isAdmin, (req, res, next) => {
    const { eventId } = req.params;
    const { client, name, startDate, endDate, description } = req.body;

    Event.findByIdAndUpdate(eventId, { client, name, startDate, endDate, description }, { new: true })
        .then(updatedEvent => res.json(updatedEvent))
        .catch(err => {
            console.log(err);
            next(err);
        });
});

// DELETE EVENT
router.post('/delete-event/:eventId', isAuthenticated, isAdmin, (req, res, next) => {
    const { eventId } = req.params;

    Event.findByIdAndDelete(eventId)
        .then(deletedEvent => res.json(deletedEvent))
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;
