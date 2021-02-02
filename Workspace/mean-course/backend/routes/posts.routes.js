const express = require("express");
const checkAuth = require("../middleware/check-auth");
const postController = require("../controllers/post.controller");
const extractFile = require("../middleware/file-upload");

const router = express.Router();

// POST - create a post
router.post("", checkAuth, extractFile, postController.createPost);

// UPDATE a post
router.put("/:id", checkAuth, extractFile, postController.updatePost);

// GET a post
router.get("/:id", postController.getPost);

// GET - get all psots
router.get("", postController.getPosts);

// DELETE a post
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
