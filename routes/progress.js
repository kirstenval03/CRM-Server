const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progressController');

// Route to mark a lesson as completed by a user
router.post('/complete-lesson', ProgressController.completeLesson);

// Route to get progress data for a user
router.get('/user-progress/:userId', ProgressController.getUserProgress);

module.exports = router;
