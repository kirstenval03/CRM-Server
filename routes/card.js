const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Define routes for cards
router.post('/cards', cardController.createCard);
router.get('/cards/:id', cardController.getCard);
router.put('/cards/:id', cardController.updateCard);
router.delete('/cards/:id', cardController.deleteCard);

module.exports = router;
