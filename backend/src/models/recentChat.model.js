import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const recentChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String, // Optional, can be auto-generated based on first message
    default: 'New Chat'
  },
  isShared: {
    type: Boolean,
    default: false
  },
  messages: [messageSchema]
}, { timestamps: true });

export const RecentChat = mongoose.model('RecentChat', recentChatSchema);
