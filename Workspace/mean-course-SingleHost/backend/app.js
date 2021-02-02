const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts.routes");
const userRoutes = require("./routes/user.routes");

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
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));

// cors
/*
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE, PUT, PATCH"
  );
  next();
});
*/

// routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
// last route to serve Angular page
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
