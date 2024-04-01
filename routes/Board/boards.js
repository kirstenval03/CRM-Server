const express = require('express');
const router = express.Router();
const { Board, Column, Card } = require('../../models/Board'); // Import Card model
const { Event, Contact } = require('../../models/Data');

// GET AN EVENT BOARD
router.get('/event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params; // Extract eventId from the request parameters

        // Find the board associated with the event ID
        let board = await Board.findOne({ eventId }).populate('columns.cards'); // Populate cards within columns

        if (!board) {
            // If the board doesn't exist, create a new board with at least one column
            const defaultColumnName = 'Registrants';
            const newColumn = new Column({ title: defaultColumnName, cards: [] }); // Initialize cards array in the column
            const columns = [newColumn]; // You can add more columns if needed

            // Find all contacts for the event
            const eventContacts = await Contact.find({ 'event.eventId': eventId });

            // Create card instances for each contact and push them into the cards array of the default column
            for (const contact of eventContacts) {
                const newCard = new Card({ contactId: contact._id });
                newColumn.cards.push(newCard);
            }

            // Create a new board instance
            board = new Board({ eventId, columns });

            // Save the new board to the database
            board = await board.save();
        }

        res.json(board); // Send the event's board as the response
    } catch (error) {
        console.error('Error getting event board:', error);
        res.status(500).json({ error: 'An error occurred while getting the event board' });
    }
});

// CREATE AN EVENT BOARD
router.post('/', async (req, res) => {
    try {
        const { eventId, columnsData } = req.body; // Extract eventId and columnsData from the request body

        // Create column instances with cards populated from columnsData
        const columns = columnsData.map(column => {
            const cards = column.cards.map(cardData => new Card({ contactId: cardData.contactId }));
            return new Column({ title: column.title, cards });
        });

        // Create a new board instance
        const newBoard = new Board({ eventId, columns });

        // Save the new board to the database
        const savedBoard = await newBoard.save();

        res.status(201).json(savedBoard); // Send the saved board as the response
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).json({ error: 'An error occurred while creating the board' });
    }
});

// UPDATE THE BOARD
router.put('/board-update/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params; // Extract boardId from the request parameters
        const { columnsData } = req.body; // Extract updated columnsData from the request body

        // Update cards within columns based on columnsData
        const updatedColumns = await Promise.all(columnsData.map(async columnData => {
            const cards = await Promise.all(columnData.cards.map(async cardData => {
                if (cardData._id) {
                    // If card already exists, update it
                    return await Card.findByIdAndUpdate(cardData._id, { contactId: cardData.contactId }, { new: true });
                } else {
                    // If card is new, create it
                    const newCard = new Card({ contactId: cardData.contactId });
                    return await newCard.save();
                }
            }));
            return { title: columnData.title, cards };
        }));

        // Find the board by its ID and update it with the new columns
        const updatedBoard = await Board.findByIdAndUpdate(boardId, { columns: updatedColumns }, { new: true });

        if (!updatedBoard) {
            return res.status(404).json({ error: 'Board not found' });
        }

        res.json(updatedBoard); // Send the updated board as the response
    } catch (error) {
        console.error('Error updating board:', error);
        res.status(500).json({ error: 'An error occurred while updating the board' });
    }
});

module.exports = router;
