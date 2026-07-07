import { Payment } from '../models/payment.model.js';
import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { Plan } from '../models/plan.model.js';

// TODO: In a real environment, you'd use a library like 'node-apple-receipt-verify' 
// or fetch directly from Apple's verification endpoint.
export const verifyAppleReceipt = async (req, res) => {
  try {
    const { receiptData, planId, transactionId } = req.body;
    const userId = req.user._id;

    if (!receiptData || !planId) {
      return res.status(400).json({ message: 'Receipt data and Plan ID are required.' });
    }

    // 1. Call Apple's verifyReceipt API (sandbox or production)
    // POST https://sandbox.itunes.apple.com/verifyReceipt
    // { "receipt-data": receiptData, "password": "YOUR_APP_SHARED_SECRET" }
    
    // 2. Validate response from Apple...
    const isValid = true; // Placeholder: assume Apple validated it
    
    if (isValid) {
      // 3. Mark in Database
      const plan = await Plan.findById(planId);
      
      const newPayment = await Payment.create({
        user: userId,
        amount: plan.price,
        provider: 'apple',
        transactionId: transactionId || `apple_${Date.now()}`,
        status: 'success'
      });

      // Assuming one-time purchase or creating a subscription entry
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);

      const newSubscription = await Subscription.create({
        user: userId,
        plan: planId,
        provider: 'apple',
        providerSubscriptionId: transactionId, // using transaction as sub id for now
        endDate
      });
      
      newPayment.subscription = newSubscription._id;
      await newPayment.save();

      res.status(200).json({ success: true, message: 'Apple purchase verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid Apple receipt.' });
    }
  } catch (error) {
    console.error('Apple verification error:', error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};

export const verifyGoogleReceipt = async (req, res) => {
  try {
    const { purchaseToken, productId, planId, transactionId } = req.body;
    const userId = req.user._id;

    if (!purchaseToken || !planId) {
      return res.status(400).json({ message: 'Purchase token and Plan ID are required.' });
    }

    // 1. Authenticate with Google Play Developer API using Service Account
    // 2. GET https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{packageName}/purchases/products/{productId}/tokens/{purchaseToken}
    
    // 3. Validate response from Google...
    const isValid = true; // Placeholder: assume Google validated it

    if (isValid) {
       // 4. Mark in Database
       const plan = await Plan.findById(planId);
       
       const newPayment = await Payment.create({
         user: userId,
         amount: plan.price,
         provider: 'google',
         transactionId: transactionId || `google_${Date.now()}`,
         status: 'success'
       });
 
       const endDate = new Date();
       endDate.setMonth(endDate.getMonth() + plan.duration);
 
       const newSubscription = await Subscription.create({
         user: userId,
         plan: planId,
         provider: 'google',
         providerSubscriptionId: purchaseToken, 
         endDate
       });
       
       newPayment.subscription = newSubscription._id;
       await newPayment.save();
 
       res.status(200).json({ success: true, message: 'Google purchase verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid Google purchase token.' });
    }
  } catch (error) {
    console.error('Google verification error:', error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};
