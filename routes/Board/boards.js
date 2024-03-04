const express = require('express');
const router = express.Router();
const { Board } = require('../../models/Board');

// GET AN EVENT BOARD
router.get('/event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params; // Extract eventId from the request parameters

        // Find the board associated with the event ID
        let board = await Board.findOne({ eventId }).populate({
            path: 'columns',
            populate: { path: 'tasks' }
        });

        if (!board) {
            // If the board doesn't exist, create a new board with at least one column
            const newColumn = { title: 'Default Column', tasks: [] };
            const columns = [newColumn]; // You can add more columns if needed

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
        const { eventId, columns } = req.body; // Extract eventId and columns from the request body

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
        const { columns } = req.body; // Extract updated columns from the request body

        // Find the board by its ID and update it with the new columns
        const updatedBoard = await Board.findByIdAndUpdate(boardId, { columns }, { new: true });

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