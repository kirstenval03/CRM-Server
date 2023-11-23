var express = require('express');
var router = express.Router();

const Event = require('../models/Event');

const isAuthenticated = require('../middleware/isAuthenticated');
const isE3 = require("../middleware/isE3");



//DISPLAY ALL EVENTS
router.get('/', (req, res, next) => {
  
    Event.find()
        .then((allEvents) => {
            res.json(allEvents)
        })
        .catch((err) => {
            console.error(err); 
            next(err)
        })
});

// SEE EVENT DETAILS
router.get('/event-detail/:eventId', (req, res, next) => {
    const { eventId } = req.params;

    Event.findById(eventId)
        .then((foundEvent) => {
            res.json(foundEvent);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

//CREATE A NEW EVENT
router.post('/new-event', isAuthenticated, isE3, (req, res, next) => {
    console.log("Received POST request at /new-event");

    const { client, event, version, date  } = req.body

    Event.create(
        { 
           client,
           event, 
           version, 
           date
        }
        )
        .then((newEvent) => {
            res.json(newEvent)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//UPDATE EVENT INFO
router.post('/event-update/:eventId', isAuthenticated, isE3, (req, res, next) => {

    const { eventId } = req.params

    const { client, event, version, date } = req.body

    Event.findByIdAndUpdate(
        eventId,
        {
            client,
            event, 
            version, 
            date
        },
        { new: true}
    )
        .then((updatedEvent) => {
            res.json(updatedEvent)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//DELETE EVENT
router.post('/delete-event/:eventId', isAuthenticated, isE3, (req, res, next) => {

    const { eventId } = req.params

    Event.findByIdAndDelete(eventId)
        .then((deletedEvent) => {
            res.json(deletedEvent)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

module.exports = router;