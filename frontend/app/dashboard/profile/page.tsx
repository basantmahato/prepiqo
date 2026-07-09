'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useRazorpay } from '../../../hooks/useRazorpay';
import api from '../../../lib/axios';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const isRazorpayLoaded = useRazorpay();
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch available plans
    const fetchPlans = async () => {
      try {
        const response = await api.get('/payment/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };
    fetchPlans();
  }, []);

  if (!mounted || !user) {
    return <div className="p-8">Loading...</div>;
  }

  const handleOpenModal = () => {
    if (!isRazorpayLoaded) {
      setMessage({ text: 'Payment system is still loading. Please try again in a moment.', type: 'error' });
      return;
    }
    if (plans.length === 0) {
      setMessage({ text: 'No subscription plans available.', type: 'error' });
      return;
    }
    setIsModalOpen(true);
  };

  const handleUpgrade = async (selectedPlan: any) => {
    setIsModalOpen(false); // Close the modal
    
    try {
      setLoadingPayment(true);
      setMessage({ text: '', type: '' });

      // 1. Create order
      const { data: orderData } = await api.post('/payment/razorpay/create-order', {
        planId: selectedPlan._id,
      });

      // 2. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MCQBot',
        description: `Upgrade to ${selectedPlan.name} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            await api.post('/payment/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: selectedPlan._id,
              internalPaymentId: orderData.paymentId,
            });

            setMessage({ text: 'Payment successful! Your account has been upgraded.', type: 'success' });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (verifyError) {
            console.error('Verification failed:', verifyError);
            setMessage({ text: 'Payment verification failed. Please contact support.', type: 'error' });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#4f46e5', // brand color
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setMessage({ text: `Payment failed: ${response.error.description}`, type: 'error' });
      });

      rzp1.open();
    } catch (error: any) {
      console.error('Error creating order:', error);
      setMessage({ text: error.response?.data?.message || 'Failed to initiate checkout', type: 'error' });
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-8 text-text-primary">My Profile</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border-subtle shadow-sm">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-border-subtle flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-gray-50/30 rounded-t-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl font-bold text-brand shadow-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{user.name}</h2>
              <p className="text-text-secondary mt-1">{user.email}</p>
            </div>
          </div>
        </div>
        
        {/* Body Section */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">Account Details</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Full Name</label>
                <div className="text-base font-medium text-text-primary mt-1">{user.name}</div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Email Address</label>
                <div className="text-base font-medium text-text-primary mt-1">{user.email}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Account ID</label>
                <div className="text-sm font-mono text-text-secondary mt-1">{user._id}</div>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">Billing & Plan</h3>
             
             <div className="bg-bg-secondary rounded-xl p-6 border border-border-subtle mt-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-text-primary">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                Current Subscription
              </h4>
              
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user.currentSubscription ? 'Pro Plan Active' : 'Active'}
                </span>
                <div className="text-xl font-bold mt-2 text-text-primary">
                  {user.currentSubscription ? 'Pro Plan' : 'Hobby (Free)'}
                </div>
              </div>
              
              <p className="text-sm text-text-secondary mb-5 leading-relaxed">
                {user.currentSubscription 
                  ? 'You are on the Pro plan with unlimited MCQ generation.' 
                  : 'You are currently on the free Hobby plan. Upgrade to Pro to unlock unlimited MCQ generation and PDF exports.'}
              </p>
              
              {!user.currentSubscription && (
                <button 
                  onClick={handleOpenModal}
                  disabled={loadingPayment || !isRazorpayLoaded}
                  className="w-full py-2.5 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loadingPayment ? 'Processing...' : 'Upgrade to Pro'}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Plans Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
                title="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.filter(p => p.price > 0).map((plan) => (
                  <div key={plan._id} className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-extrabold text-text-primary">₹{plan.price}</span>
                        <span className="text-sm font-medium text-text-secondary">/{plan.name.toLowerCase() === 'yearly' ? 'year' : 'month'}</span>
                      </div>
                      
                      <ul className="space-y-3 mb-8">
                        {plan.features?.length > 0 ? (
                          plan.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                              <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              {feature}
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start gap-2 text-sm text-text-secondary">
                              <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              Unlimited MCQ Generations
                            </li>
                            <li className="flex items-start gap-2 text-sm text-text-secondary">
                              <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              Export to PDF & DOCX
                            </li>
                            <li className="flex items-start gap-2 text-sm text-text-secondary">
                              <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              Priority Support
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <button 
                      onClick={() => handleUpgrade(plan)}
                      className="w-full py-3 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand/90 transition-colors shadow-sm"
                    >
                      Select {plan.name}
                    </button>
                  </div>
                ))}
              </div>
              
              {plans.filter(p => p.price > 0).length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                  No premium plans are available right now.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
