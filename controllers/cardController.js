const Card = require('../models/Board/Card');
const Column = require('../models/Board/Column');

// Create a new card
exports.createCard = async (req, res) => {
  try {
    const { title, description, position, columnId } = req.body;

    // Ensure the column exists
    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Create the new card with title, description, position, and columnId
    const card = new Card({ title, description, position, columnId });
    await card.save();

    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Error creating card' });
  }
};

// Get a card by ID
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Error getting card:', error);
    res.status(500).json({ error: 'Error getting card' });
  }
};

// Update a card by ID
exports.updateCard = async (req, res) => {
  try {
    const { title, description, position, columnId } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Ensure the column exists if columnId is provided
    if (columnId) {
      const column = await Column.findById(columnId);
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }
    }

    // Update the card with the provided data
    card.title = title || card.title;
    card.description = description || card.description;
    card.position = position || card.position;
    card.columnId = columnId || card.columnId;

    await card.save();

    res.status(200).json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Error updating card' });
  }
};

// Delete a card by ID
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await card.remove();

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Error deleting card' });
  }
};
