const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true }],
  quantity: { type: Number, required: true },
  variant: { price: Number, mg: Number },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
