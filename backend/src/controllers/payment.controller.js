import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Plan } from '../models/plan.model.js';
import { Payment } from '../models/payment.model.js';
import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

// Initialize Razorpay instance. Ensure these are set in your .env
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

/**
 * Creates a Razorpay Order
 */
export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Razorpay amount is in the smallest currency unit (e.g., paise for INR)
    const amountInPaise = plan.price * 100;

    const options = {
      amount: amountInPaise,
      currency: plan.currency,
      receipt: `rcpt_${userId.toString().slice(-6)}_${Date.now()}`,
    };

    // Create order via Razorpay API
    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Some error occurred generating Razorpay order' });
    }

    // Save pending payment record
    const payment = await Payment.create({
      user: userId,
      amount: plan.price,
      currency: plan.currency,
      status: 'pending',
      transactionId: order.id, // Using Razorpay Order ID as initial transaction ID
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id, // Internal database ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verifies the Razorpay payment signature and updates database
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      internalPaymentId
    } = req.body;

    const userId = req.user._id;

    // Cryptographically verify the signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Mark internal payment as failed
      await Payment.findByIdAndUpdate(internalPaymentId, { status: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Payment is valid. Update payment status.
    const payment = await Payment.findByIdAndUpdate(internalPaymentId, {
      status: 'success',
      transactionId: razorpay_payment_id // Update to actual payment ID
    });

    // Create or update the Subscription
    const plan = await Plan.findById(planId);
    
    // Calculate end date based on plan name (assuming 'Monthly' or 'Yearly')
    const endDate = new Date();
    if (plan.name.toLowerCase() === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      // Default to monthly
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      status: 'active',
      startDate: new Date(),
      endDate: endDate,
      providerSubscriptionId: razorpay_order_id
    });

    // Link subscription to payment and user
    payment.subscription = subscription._id;
    await payment.save();

    await User.findByIdAndUpdate(userId, {
      currentSubscription: subscription._id
    });

    const user = await User.findById(userId);

    // Send confirmation email
    sendEmail({
      email: user.email,
      subject: 'Payment Successful - Subscription Activated',
      message: `Hi ${user.name},\n\nYour payment for the ${plan.name} plan was successful.\nTransaction ID: ${razorpay_payment_id}\n\nThank you for subscribing!`,
      htmlMessage: `<h3>Hi ${user.name},</h3><p>Your payment for the <strong>${plan.name}</strong> plan was successful.</p><p>Transaction ID: ${razorpay_payment_id}</p><p>Thank you for subscribing!</p>`,
    });

    res.json({ message: 'Payment verified successfully and subscription activated!' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message });
  }
};
