const express = require('express');
const router = express.Router();
const { Board, Column } = require('../../models/Board');

// Route for getting all columns within an event's board
router.get('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params; // Extract eventId from the request parameters

        // Find the board by its event ID
        const board = await Board.findOne({ eventId }).populate('columns.tasks');

        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        res.json(board.columns); // Send the columns as the response
    } catch (error) {
        console.error('Error getting columns:', error);
        res.status(500).json({ error: 'An error occurred while getting the columns' });
    }
});

// Route for creating a new column within an event's board
router.post('/event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params; // Extract eventId from the request parameters
        const { title } = req.body; // Extract title from the request body

        // Find the board by its event ID
        const board = await Board.findOne({ eventId });

        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        // Create a new column instance
        const newColumn = new Column({ title });

        // Push the new column to the board's columns array
        board.columns.push(newColumn);

        // Save the updated board to the database
        await board.save();

        res.status(201).json(newColumn); // Send the newly created column as the response
    } catch (error) {
        console.error('Error creating column:', error);
        res.status(500).json({ error: 'An error occurred while creating the column' });
    }
});

// Route for updating an existing column within an event's board
router.put('/:eventId/:columnId', async (req, res) => {
    try {
        const { eventId, columnId } = req.params; // Extract eventId and columnId from the request parameters
        const { title } = req.body; // Extract updated title from the request body

        // Find the board by its event ID
        const board = await Board.findOne({ eventId });

        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        // Find the column by its ID within the board's columns array
        const columnToUpdate = board.columns.id(columnId);

        if (!columnToUpdate) {
            return res.status(404).json({ error: 'Column not found' });
        }

        // Update the column's title
        columnToUpdate.title = title;

        // Save the updated board to the database
        await board.save();

        res.json(columnToUpdate); // Send the updated column as the response
    } catch (error) {
        console.error('Error updating column:', error);
        res.status(500).json({ error: 'An error occurred while updating the column' });
    }
});

// Route for deleting a column within an event's board
router.delete('/:eventId/columns/:columnId', async (req, res) => {
    try {
        const { eventId, columnId } = req.params; // Extract eventId and columnId from the request parameters

        // Find the board by its event ID
        const board = await Board.findOne({ eventId });

        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        // Find the column by its ID within the board's columns array and remove it
        board.columns.id(columnId).remove();

        // Save the updated board (with the column removed) to the database
        await board.save();

        res.json({ message: 'Column deleted successfully' });
    } catch (error) {
        console.error('Error deleting column:', error);
        res.status(500).json({ error: 'An error occurred while deleting the column' });
    }
});

module.exports = router;
