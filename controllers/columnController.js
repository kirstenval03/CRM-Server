const Column = require('../models/Board/Column');
const Card = require('../models/Board/Card');

// Create a new column
exports.createColumn = async (req, res) => {
    try {
      const { title } = req.body;
  
      // Determine the default position based on the number of existing columns
      const existingColumnsCount = await Column.countDocuments({});
      const position = existingColumnsCount + 1;
  
      // Create the new column with title and position
      const column = new Column({ title, position });
      await column.save();
  
      res.status(201).json(column);
    } catch (error) {
      console.error('Error creating column:', error);
      res.status(500).json({ error: 'Error creating column' });
    }
  };
  

// Get a column by ID
exports.getColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id).populate('cardIds');
    
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    res.status(200).json(column);
  } catch (error) {
    console.error('Error getting column:', error);
    res.status(500).json({ error: 'Error getting column' });
  }
};

// Update a column by ID (including title and position)
exports.updateColumn = async (req, res) => {
    try {
      const { title, position } = req.body;
  
      const column = await Column.findById(req.params.id);
  
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }
  
      // Update the title if provided
      if (title !== undefined) {
        column.title = title;
      }
  
      // If position is provided, update the position
      if (position !== undefined && position !== null && position !== column.position) {
        // Find the columns with positions greater than or equal to the new position
        const columnsToShift = await Column.find({ position: { $gte: position } });
  
        // Update the positions of columns to make space for the moved column
        columnsToShift.forEach(async (col) => {
          if (col._id.toString() !== column._id.toString()) {
            col.position += 1;
            await col.save();
          }
        });
  
        // Update the position of the moved column
        column.position = position;
      }
  
      await column.save();
  
      res.status(200).json(column);
    } catch (error) {
      console.error('Error updating column:', error);
      res.status(500).json({ error: 'Error updating column' });
    }
  };

// Delete a column by ID
exports.deleteColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);

    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Delete all cards within the column
    await Card.deleteMany({ columnId: req.params.id });

    // Delete the column itself
    await column.remove();

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Error deleting column' });
  }
};
