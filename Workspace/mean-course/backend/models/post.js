const mongoose = require("mongoose");

// schema is blueprint of how the Post object will look like
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema); // collection name will be 'posts'
