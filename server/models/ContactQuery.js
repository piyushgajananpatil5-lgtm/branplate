const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    orderId: { type: String, default: '' },
    category: { type: String, enum: ['General Query', 'Refund Request'], default: 'General Query' },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactQuery', contactQuerySchema);
