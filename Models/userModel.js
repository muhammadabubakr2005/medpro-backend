const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    address: [
      {type: String, required: true}
    ],
    image: { type: String },
    // salt: { type: String },
  },
  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);
