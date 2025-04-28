const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: [{ type: String, required: true }], // e.g., ['Antibiotic', 'Painkiller']
  variants: [
    {
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      mg: { type: Number, required: true }
    }
  ],
  description: String,
  imageUrl: String,
  // prescriptionRequired: { type: Boolean, default: false },
  // addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
