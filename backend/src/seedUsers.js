import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mcqbot');
    console.log('MongoDB connected for seeding...');

    // Clear existing test users if they exist
    await User.deleteMany({ email: { $in: ['admin@mcqbot.com', 'user@mcqbot.com'] } });

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@mcqbot.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });
    console.log(`Created admin: ${admin.email}`);

    // Create Normal User
    const user = await User.create({
      name: 'Standard User',
      email: 'user@mcqbot.com',
      password: hashedPassword,
      role: 'user',
      isVerified: true
    });
    console.log(`Created standard user: ${user.email}`);

    console.log('User seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
