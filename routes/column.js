const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');

// Define routes for columns
router.post('/columns', columnController.createColumn);
router.get('/columns/:id', columnController.getColumn);
router.put('/columns/:id', columnController.updateColumn);
router.delete('/columns/:id', columnController.deleteColumn);

module.exports = router;
