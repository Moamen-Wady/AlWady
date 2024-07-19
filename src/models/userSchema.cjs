const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  _id: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
