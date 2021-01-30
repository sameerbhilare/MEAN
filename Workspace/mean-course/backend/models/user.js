const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/*
  We cannot depend upon mongoose' unique: true as it is used to do some internal optimizations
  and we cannot rely on it. Hence using mongoose-unique-validator plugin
  Unique validator is a plugin that will simply add an extra hook
  that checks your data before it saves it to the database.
*/
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
