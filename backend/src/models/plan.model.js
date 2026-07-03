import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  maxRequestsPerWindow: {
    type: Number,
    required: true,
    default: 100 // Example default limit
  },
  features: [{
    type: String
  }]
}, { timestamps: true });

export const Plan = mongoose.model('Plan', planSchema);
