import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import { getPlans } from '../controllers/plan.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get available subscription plans
router.get('/plans', getPlans);

// Both routes require the user to be logged in
router.post('/razorpay/create-order', protect, createOrder);
router.post('/razorpay/verify', protect, verifyPayment);

export default router;
