const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // required for creation and validation of JWT
const User = require("../models/user");

exports.createUser = (req, res, next) => {
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
          message: "Invalid Email or Password.",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid Email or Password.",
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
          message: "Invalid Email or Password.",
        });
      }

      // all good to return jwt to client
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // send token
      /*
        Send token expiry duration to frontend so that frontend can logout automatically.
        We can send in whichever ways to fronend, e.g. in seconds, minutes, hrs, custom string,
        but accordingly the frontend needs to take action.
        Here we are sending it in seconds.
        3600 seconds = 1h as we set expiresIn property for our JWT above.
      */
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "Invalid Email or Password.",
      });
    });
};
