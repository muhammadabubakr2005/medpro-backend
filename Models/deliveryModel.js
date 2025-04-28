const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  assignedTo: { type: String },
  status: { type: String, enum: ['assigned', 'dispatched', 'delivered'], default: 'assigned' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);
