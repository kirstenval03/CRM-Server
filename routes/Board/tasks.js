const express = require('express');
const router = express.Router();
const { Board, Task } = require('../../models/Board');

// Route for getting all tasks within a column
router.get('/:boardId/columns/:columnId', async (req, res) => {
    try {
      const { boardId, columnId } = req.params; // Extract boardId and columnId from the request parameters
  
      // Find the board by its ID
      const board = await Board.findById(boardId);
  
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
  
      // Find the column by its ID within the board's columns array
      const column = board.columns.id(columnId);
  
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }
  
      // Populate the taskIds in the column to retrieve the tasks
      await column.populate('taskIds').execPopulate();
  
      res.json(column.taskIds); // Send the tasks within the column as the response
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'An error occurred while getting the tasks' });
    }
  });

//CREATE A TASK
router.post('/:boardId/columns/:columnId', async (req, res) => {
  try {
    const { boardId, columnId } = req.params; // Extract boardId and columnId from the request parameters
    const { contactId, indexPosition } = req.body; // Extract contactId and indexPosition from the request body

    // Find the board by its ID
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Find the column by its ID within the board's columns array
    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Create a new task instance
    const newTask = new Task({ contact: contactId, indexPosition });

    // Push the new task to the column's taskIds array
    column.taskIds.push(newTask);

    // Save the updated board to the database
    await board.save();

    res.status(201).json(newTask); // Send the newly created task as the response
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'An error occurred while creating the task' });
  }
});

//UPDATE A TASK
router.put('/:boardId/columns/:columnId/:taskId', async (req, res) => {
  try {
    const { boardId, columnId, taskId } = req.params; // Extract boardId, columnId, and taskId from the request parameters
    const { contactId, indexPosition } = req.body; // Extract updated contactId and indexPosition from the request body

    // Find the board by its ID
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Find the column by its ID within the board's columns array
    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Find the task by its ID within the column's taskIds array
    const taskToUpdate = column.taskIds.id(taskId);

    if (!taskToUpdate) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task's properties
    if (contactId) {
      taskToUpdate.contact = contactId;
    }
    if (indexPosition) {
      taskToUpdate.indexPosition = indexPosition;
    }

    // Save the updated board to the database
    await board.save();

    res.json(taskToUpdate); // Send the updated task as the response
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'An error occurred while updating the task' });
  }
});

//DELETE TASKS
router.delete('/:boardId/columns/:columnId/:taskId', async (req, res) => {
  try {
    const { boardId, columnId, taskId } = req.params; // Extract boardId, columnId, and taskId from the request parameters

    // Find the board by its ID
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Find the column by its ID within the board's columns array
    const column = board.columns.id(columnId);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Find the task by its ID within the column's taskIds array and remove it
    column.taskIds.id(taskId).remove();

    // Save the updated board (with the task removed) to the database
    await board.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
});

module.exports = router;
