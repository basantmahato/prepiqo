import mongoose from 'mongoose';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import { Plan } from './models/plan.model.js';

const seedPlans = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Check if plans already exist to avoid duplicates
    const existingPlans = await Plan.find();
    if (existingPlans.length > 0) {
      console.log('Plans already exist in the database. Aborting seed.');
      process.exit(0);
    }

    const plans = [
      {
        name: 'Monthly',
        price: 49,
        currency: 'INR',
        maxRequestsPerWindow: 1000, // Example limit for premium
        features: ['Access to all features', 'Priority support', '1000 requests per 15 mins']
      },
      {
        name: 'Yearly',
        price: 399,
        currency: 'INR',
        maxRequestsPerWindow: 2000, // Example limit for yearly
        features: ['Access to all features', '24/7 Priority support', '2000 requests per 15 mins', 'Save ~17%']
      }
    ];

    // Insert plans
    await Plan.insertMany(plans);
    console.log('Successfully seeded the Monthly and Yearly plans!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();
