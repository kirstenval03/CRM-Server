var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User");

const saltRounds = 10;

router.post("/signup", async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Provide email, password, first name, and last name." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = determineUserRole(email.toLowerCase());

    // CREATE USER
    const newUser = await User.create({
      email: email.toLowerCase(), // Store email in lowercase
      password: hashedPassword,
      firstName,
      lastName,
      role
    });

    const payload = { email: newUser.email, _id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, role: newUser.role };
    const authToken = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(201).json({ authToken, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password); 

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password." });
  }

  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);
    console.log("Password correct:", passwordCorrect);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = { email: foundUser.email, _id: foundUser._id, firstName: foundUser.firstName, lastName: foundUser.lastName };
    const authToken = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = router;

// Helper function to determine user role
function determineUserRole(email) {
  if (email.endsWith('@e3events.io')) {
    return 'admin';
  } else if (email.endsWith('@youreventcoach.com')) {
    return 'sales_coach';
  } else {
    return 'academy_member';
  }
}
