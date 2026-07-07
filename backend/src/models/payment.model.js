import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null // Could be null if it's a one-time payment not tied to a sub
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  provider: {
    type: String,
    enum: ['razorpay', 'apple', 'google'],
    default: 'razorpay'
  },
  transactionId: {
    type: String, // Provider's order/receipt ID
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
