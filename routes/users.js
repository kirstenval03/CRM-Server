var express = require('express');
var router = express.Router();
const User = require("../models/User");
const isAuthenticated = require('../middleware/isAuthenticated');

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

module.exports = router;
