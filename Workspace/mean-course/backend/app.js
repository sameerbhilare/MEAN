const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
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
