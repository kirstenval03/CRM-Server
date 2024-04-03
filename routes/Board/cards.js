const express = require('express');
const router = express.Router();
const { Card } = require('../../models/Board');
const { Contact } = require('../../models/Data');

// POST Create a New Card Route
router.post('/', async (req, res) => {
    try {
        const { contactId, columnId } = req.body; // Extract contactId and columnId from the request body

        // Create a new card instance
        const newCard = new Card({ contactId, columnId });

        // Save the new card to the database
        const savedCard = await newCard.save();

        res.status(201).json(savedCard); // Send the saved card as the response
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'An error occurred while creating the card' });
    }
});

// GET All Cards in a Column Route (Optional, if needed)
router.get('/column/:columnId', async (req, res) => {
    try {
        const { columnId } = req.params; // Extract columnId from the request parameters

        // Find all cards in the specified column
        const cards = await Card.find({ columnId });

        if (!cards) {
            return res.status(404).json({ error: 'Cards not found' });
        }

        res.status(200).json(cards); // Send the cards as the response
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'An error occurred while fetching the cards' });
    }
});

// DELETE Delete a Card Route
router.delete('/:cardId', async (req, res) => {
    try {
        const { cardId } = req.params; // Extract cardId from the request parameters

        // Find the card by its ID and delete it
        const deletedCard = await Card.findByIdAndDelete(cardId);

        if (!deletedCard) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: 'An error occurred while deleting the card' });
    }
});

module.exports = router;