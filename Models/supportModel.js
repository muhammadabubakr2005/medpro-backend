const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  subject: String,
  message: String,
  // status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
