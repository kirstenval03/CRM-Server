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

router.delete('/unmark-lesson/:lessonId', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user._id;
      const lessonId = req.params.lessonId; // Get lessonId from URL parameters
  
      // Find the user's progress based on their userId
      const userProgress = await Progress.findOne({ userId });
  
      // Check if the lesson is in the completedLessons array
      if (!userProgress.completedLessons.includes(lessonId)) {
        return res.status(400).json({ error: 'Lesson is not marked as completed' });
      }
  
      // Remove the lesson from the completedLessons array
      userProgress.completedLessons = userProgress.completedLessons.filter(
        (completedLessonId) => completedLessonId.toString() !== lessonId.toString()
      );
  
      // Save the updated progress to the database
      await userProgress.save();
  
      res.json({ message: 'Lesson unmarked as completed' });
    } catch (error) {
      console.error('Error unmarking lesson as completed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to get a user's progress
router.get('/user-progress/:userId', isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId; // Get userId from URL parameters
  
      // Find the user's progress based on their userId
      const userProgress = await Progress.findOne({ userId });
  
      if (!userProgress) {
        return res.status(404).json({ error: 'User progress not found' });
      }
  
      res.json(userProgress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
