const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
      // variantIndex: { type: Number, required: true },
      mg: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  // status: { type: String, enum: ['pending', 'in-progress', 'delivered', 'cancelled'], default: 'pending' },
  deliveryAddress: String,
  paymentStatus: { type: String, enum: ['paid', 'unpaid', 'failed'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
  // prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' ,required: false },
  orderDate: { type: Date, default: Date.now },  
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
