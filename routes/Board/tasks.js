const express = require('express');
const router = express.Router();
const { Board } = require('../../models/Board');

// Route for getting all tasks within a column
router.get('/:boardId/column/:columnId', async (req, res) => {
  try {
    const { boardId, columnId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    res.json(column.tasks); // Return tasks directly from the column
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'An error occurred while getting the tasks' });
  }
});

//CREATE A TASK
router.post('/:boardId/column/:columnId', async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { contactId, indexPosition } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Create a new task directly within the column
    column.tasks.push({ contact: contactId, indexPosition });

    await board.save();

    res.status(201).json(column.tasks[column.tasks.length - 1]); // Return the newly created task
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'An error occurred while creating the task' });
  }
});

//UPDATE A TASK
router.put('/:boardId/column/:columnId/:taskId', async (req, res) => {
  try {
    const { boardId, columnId, taskId } = req.params;
    const { contactId, indexPosition } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    const taskToUpdate = column.tasks.id(taskId);

    if (!taskToUpdate) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task properties directly
    if (contactId) {
      taskToUpdate.contact = contactId;
    }
    if (indexPosition) {
      taskToUpdate.indexPosition = indexPosition;
    }

    await board.save();

    res.json(taskToUpdate);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'An error occurred while updating the task' });
  }
});

//DELETE TASKS
router.delete('/:boardId/column/:columnId/:taskId', async (req, res) => {
  try {
    const { boardId, columnId, taskId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    column.tasks.id(taskId).remove();

    await board.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
});

module.exports = router;
