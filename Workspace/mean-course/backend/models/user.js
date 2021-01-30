const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/*
  Unique validator is a plugin that will simply add an extra hook
  that checks your data before it saves it to the database.
*/
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
