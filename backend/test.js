import mongoose from 'mongoose';
import { RecentChat } from './src/models/recentChat.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mcqbot');
    const chats = await RecentChat.find().sort({ createdAt: -1 }).limit(2);
    console.log(JSON.stringify(chats, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
check();
