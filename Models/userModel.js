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
      {
        _id: false, // if you want to use custom `_id`, set this to true
        street: String,
        city: String,
        postalCode: String,
        country: String,
        label: String, // e.g., "Home", "Office"
      }
    ]
    
  },
  { timestamps: true }

);

module.exports = mongoose.model("User", userSchema);
