// routes/progress.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress'); // Import your Progress model
const isAuthenticated = require('../middleware/isAuthenticated'); // Add your authentication middleware

// Route to mark a lesson as completed by a user
router.post('/complete-lesson', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming your middleware adds user ID to req.user
    const lessonId = req.body.lessonId; // Assuming you send the lesson ID in the request body

    // Check if the lesson is already marked as completed for the user
    const userProgress = await Progress.findOne({ userId });
    if (userProgress.completedLessons.includes(lessonId)) {
      return res.status(400).json({ error: 'Lesson already completed' });
    }

    // Add the lesson to the user's completed lessons
    userProgress.completedLessons.push(lessonId);
    await userProgress.save();

    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
