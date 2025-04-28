const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    medicineIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
}, { timestamps: true });
module.exports = mongoose.model('Category', categorySchema);