import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: [true, 'Transaction type is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema); 