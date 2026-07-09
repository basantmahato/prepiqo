import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-24">
        <h1 className="text-4xl font-bold text-text-primary mb-8 tracking-tight">Refund & Cancellation Policy</h1>
        <div className="prose prose-slate max-w-none text-text-secondary">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">1. Subscription Cancellations</h2>
          <p className="mb-4">You may cancel your subscription at any time. When you cancel, you will continue to have access to the service through the end of your current billing period. After the billing period ends, your account will be downgraded to the free plan.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">2. Refund Eligibility</h2>
          <p className="mb-4">We offer a 14-day money-back guarantee for all new subscriptions. If you are not satisfied with our service, you may request a full refund within 14 days of your initial purchase. Refunds requested after this 14-day period will be reviewed on a case-by-case basis and granted at our sole discretion.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">3. How to Request a Refund</h2>
          <p className="mb-4">To request a refund, please contact our support team with your account email address and the reason for your request. We will process your refund within 5-7 business days. Please note that it may take additional time for the funds to appear in your account depending on your payment provider.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">4. Changes to this Policy</h2>
          <p className="mb-4">We reserve the right to modify this refund policy at any time. Any changes will be effective immediately upon posting to this page.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Refund & Cancellation Policy, please contact us.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
