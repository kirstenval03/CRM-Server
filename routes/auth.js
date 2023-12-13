var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User");

const saltRounds = 10;

// Helper function to determine user role
const determineUserRole = (email) => {
  if (email.endsWith('@e3events.io')) {
    return 'admin';
  } else if (email.endsWith('@youreventcoach.com')) {
    return 'sales_coach';
  } else {
    return 'academy_member';
  }
};

router.post("/signup", (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (email === "" || password === "" || !firstName || !lastName) {
    res.status(400).json({ message: "Provide email, password, first name, and last name." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Determine the user's role based on the email domain
      const role = determineUserRole(email);

      User.create({ email, password: hashedPassword, firstName, lastName, role })
        .then((createdUser) => {
          const { email, _id, firstName, lastName, role } = createdUser;

          const payload = { email, _id, firstName, lastName, role };

          const authToken = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });

          res.status(200).json({ authToken, role });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { email, _id, firstName, lastName, isE3 } = foundUser;
        const payload = { email, _id, firstName, lastName, isE3 };
        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.user", req.user);
  res.status(200).json(req.user);
});

module.exports = router;
