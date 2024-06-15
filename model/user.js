const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
}, {
  timestamps: true 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
