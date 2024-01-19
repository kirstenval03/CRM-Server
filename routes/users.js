var express = require('express');
var router = express.Router();
const User = require("../models/User");
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin'); 

/* GET current authenticated user. */
router.get('/current', isAuthenticated, async (req, res) => {
  try {
    // The isAuthenticated middleware should add the user to req
    const userId = req.user._id; // Assuming your middleware adds user ID to req.user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Set headers to prevent caching
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', 0);



    // Return the user data as JSON
    res.json(user); // You can include all user fields or just specific ones
  } catch (error) {
    console.error('Error fetching current user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/all', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find();

    // Set headers to prevent caching
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', 0);

    // Return the list of users as JSON
    res.json(users); // You can include all user fields or just specific ones
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// UPDATE USER 
router.post('/:userId', isAuthenticated, isAdmin,  async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const userId = req.params.userId;

    // Check if the authenticated user is allowed to perform this update
    if (req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only update your own profile.' });
    }

    // Find the user by ID and update their data
    const updatedUserData = req.body; // Assuming the request body contains the updated user data
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated user as JSON
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE USER
router.delete('/delete/:userId', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const userId = req.params.userId;

    // Check if the authenticated user is allowed to perform this delete operation
    if (req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own profile.' });
    }

    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(userId);

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return a success message
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
