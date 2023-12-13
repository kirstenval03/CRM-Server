var express = require('express');
var router = express.Router();
const User = require("../models/User");
const isAuthenticated = require("../middleware/isAuthenticated");
const isProfileOwner = require('../middleware/isProfileOwner');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
