import mongoose from 'mongoose';

const anonymousUsageSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  requestCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const AnonymousUsage = mongoose.model('AnonymousUsage', anonymousUsageSchema);
