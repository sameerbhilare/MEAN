const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // required for creation and validation of JWT
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config.env" });
const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

// signup
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash, // save hashed password
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User successfully created.",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

// login
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }

      fetchedUser = user;

      // return promise
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      // result of bcrypt.compare()
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }

      // all good to return jwt to client
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // send token
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "Auth Failed",
      });
    });
});

module.exports = router;
