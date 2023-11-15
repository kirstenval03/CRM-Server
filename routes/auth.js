var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middleware/isAuthenticated");

const User = require("../models/User");

const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email, password, and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Determine if the user is an E3 member
  const isE3 = email.endsWith('@e3events.io');

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      User.create({ email, password: hashedPassword, firstName, lastName, isE3 })
        .then((createdUser) => {
          const { email, _id, firstName, lastName, isE3 } = createdUser;

          const payload = { email, _id, firstName, lastName, isE3 };

          const authToken = jwt.sign(payload, process.env.SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });

          res.status(200).json({ authToken });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.log(err);
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
        const { email, _id, firstName, lastName, username, isE3 } = foundUser;
        const payload = { email, _id, firstName, lastName, username, isE3 };
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
