const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    // status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    relatedMedicineIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    uploadedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Prescription', prescriptionSchema);