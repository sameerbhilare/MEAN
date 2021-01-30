const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config.env" });
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts.routes");

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

// static files
app.use("/images", express.static(path.join("backend/images")));

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

// routes for 'Posts'
app.use("/api/posts", postsRoutes);

module.exports = app;
