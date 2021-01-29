const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config.env" });
const mongoose = require("mongoose");
const Post = require("./models/post");

const app = express();

// connect to the database
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Connected !");
  })
  .catch(() => {
    console.log("Connection Failed.");
  });

// parser body
app.use(bodyParser.json()); // for json body
app.use(bodyParser.urlencoded()); // for url encoded body (html form)

// cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE, PUT, PATCH"
  );
  next();
});

// POST - create a post
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // save to DB
  post.save();
  res.status(201).json({
    message: "Post added successfully!",
  });
});

// GET - get all psots
app.get("/api/posts", (req, res, next) => {
  // fetch all posts from DB
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts Fetched successfully",
      posts: posts,
    });
  });
});

// DELETE a post
app.delete("/api/posts/:id", (req, res, next) => {
  // fetch all posts from DB
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Posts Deleted",
    });
  });
});

module.exports = app;
