'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../lib/axios';

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/payment/plans');
        setPlans(res.data || []);
      } catch (error) {
        console.error('Failed to fetch plans', error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <section id="pricing" className="py-24 border-t border-border-subtle">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-text-secondary max-w-[600px] mx-auto text-sm md:text-base">Start for free and upgrade when you need more power.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-${safePlans.length > 0 ? safePlans.length + 1 : 2} gap-8 max-w-5xl mx-auto px-4`}>
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-10 border border-border-subtle shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-2">Hobby</h3>
          <p className="text-text-secondary text-sm mb-6">Perfect for casual learners testing the waters.</p>
          <div className="text-5xl font-bold mb-8">₹0<span className="text-lg text-text-secondary font-medium">/mo</span></div>
          <ul className="space-y-4 mb-10 flex-1">
            <li className="flex items-center gap-3 text-sm text-text-primary">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Try 5 times without logging in
            </li>
            <li className="flex items-center gap-3 text-sm text-text-primary">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              15 Free Requests every week after sign up
            </li>
            <li className="flex items-center gap-3 text-sm text-text-primary">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Access to all 4 Generation Modes
            </li>
          </ul>
          <Link href="/dashboard" className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-md bg-white border border-border-strong text-text-primary hover:bg-gray-50 transition-all shadow-sm">
            Try Now
          </Link>
        </div>

        {/* Dynamic Pro Plans */}
        {loading ? (
          <div className="bg-[#4F46E5] rounded-3xl p-10 shadow-xl flex flex-col relative text-white items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : safePlans.length > 0 ? safePlans.filter(p => p?.price > 0).map((plan, index) => (
          <div key={plan._id || index} className={`${index === 0 ? 'bg-[#4F46E5] text-white transform md:-translate-y-4 shadow-xl' : 'bg-white text-text-primary shadow-sm border border-border-subtle'} rounded-3xl p-10 flex flex-col relative`}>
            {index === 0 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className={index === 0 ? "text-indigo-200 text-sm mb-6" : "text-text-secondary text-sm mb-6"}>For educators and heavy users.</p>
            <div className="text-5xl font-bold mb-8">₹{plan.price}<span className={index === 0 ? "text-lg text-indigo-200 font-medium" : "text-lg text-text-secondary font-medium"}>/{plan.name?.toLowerCase() === 'yearly' ? 'yr' : 'mo'}</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features?.length > 0 ? plan.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <svg className={`w-5 h-5 shrink-0 ${index === 0 ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {feature}
                </li>
              )) : (
                <>
                  <li className="flex items-center gap-3 text-sm">
                    <svg className={`w-5 h-5 shrink-0 ${index === 0 ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {plan.maxRequestsPerWindow || 300} Requests per Week
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <svg className={`w-5 h-5 shrink-0 ${index === 0 ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Advanced Difficulty & Unlimited PDFs
                  </li>
                </>
              )}
            </ul>
            <Link href="/dashboard/profile" className={`w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-md transition-all shadow-sm ${index === 0 ? 'bg-white text-brand hover:bg-gray-100' : 'bg-brand text-white hover:bg-[#4338CA]'}`}>
              Upgrade to Pro
            </Link>
          </div>
        )) : null}
      </div>
    </section>
  );
}
