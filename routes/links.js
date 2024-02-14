const express = require('express');
const router = express.Router();
const { Event } = require('../models/Data');

// GET ALL LINKS FOR EVENT
router.get('/:eventId', async (req, res, next) => {
    try {
      const { eventId } = req.params;
  
      // Find the event by ID
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).send('Event not found');
      }
  
      // Send the event links
      res.json(event.eventLinks);
    } catch (error) {
      console.error('Error retrieving event links:', error);
      next(error);
    }
  });

// CREATE LINK FOR EVENT
router.post('/new-link/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { title, link } = req.body;

    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Add the new link to the event
    event.eventLinks.push({ title, link });

    // Save the updated event
    const updatedEvent = await event.save();

    res.status(201).json(updatedEvent);
  } catch (error) {
    console.error('Error creating link:', error);
    next(error);
  }
});

// UPDATE LINK FOR EVENT
router.post('/update-link/:eventId/:linkId', async (req, res, next) => {
  try {
    const { eventId, linkId } = req.params;
    const { title, link } = req.body;

    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Find the index of the link in the event's eventLinks array
    const linkIndex = event.eventLinks.findIndex(link => link._id == linkId);

    if (linkIndex === -1) {
      return res.status(404).send('Link not found');
    }

    // Update the link
    event.eventLinks[linkIndex].title = title;
    event.eventLinks[linkIndex].link = link;

    // Save the updated event
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating link:', error);
    next(error);
  }
});

// DELETE LINK FOR EVENT
router.delete('/delete-link/:eventId/:linkId', async (req, res, next) => {
  try {
    const { eventId, linkId } = req.params;

    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Filter out the link to delete
    event.eventLinks = event.eventLinks.filter(link => link._id != linkId);

    // Save the updated event
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error deleting link:', error);
    next(error);
  }
});

module.exports = router;
