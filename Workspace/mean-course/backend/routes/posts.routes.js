const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/post");

const router = express.Router();

// POST - create a post
router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // save to DB
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully!",
      postId: createdPost._id,
    });
  });
});

// UPDATE a post
router.put("/:id", (req, res, next) => {
  Post.updateOne(
    { _id: req.params.id },
    { title: req.body.title, content: req.body.content }
  ).then(() => {
    res.status(200).json({
      message: "Post updated successfully.",
    });
  });
});

// GET a post
router.get("/:id", (req, res, next) => {
  // fetch all posts from DB
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json("Post Not Found !");
    }
  });
});

// GET - get all psots
router.get("", (req, res, next) => {
  // fetch all posts from DB
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts Fetched successfully",
      posts: posts,
    });
  });
});

// DELETE a post
router.delete("/:id", (req, res, next) => {
  // fetch all posts from DB
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Posts Deleted",
    });
  });
});

module.exports = router;
