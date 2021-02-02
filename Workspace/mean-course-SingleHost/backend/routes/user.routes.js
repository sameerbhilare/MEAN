const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

// signup
router.post("/signup", userController.createUser);

// login
router.post("/login", userController.userLogin);

module.exports = router;
