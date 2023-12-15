var express = require('express');
var router = express.Router();
const User = require("../models/User");

/* GET user by email. */
router.get('/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data as JSON
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
