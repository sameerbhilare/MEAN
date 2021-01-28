const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added successfully!",
  });
});

// GET - get all psots
app.get("/api/posts", (req, res, next) => {
  const posts = [
    { id: "asad1212", title: "First Post", content: "First post content" },
    { id: "asad1213", title: "Second Post", content: "Second post content" },
  ];

  res.status(200).json({
    message: "Posts Fetched successfully",
    posts: posts,
  });
});

module.exports = app;
