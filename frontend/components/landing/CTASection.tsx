import React from 'react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="bg-[#4F46E5] rounded-[2rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to ace your next exam?</h2>
          <p className="text-indigo-100 mb-10 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Join 5,000+ students already improving their grades with our AI tools. No credit card required to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-md bg-white text-brand hover:bg-gray-50 transition-colors shadow-sm">
              Start Generating for Free
            </Link>
            <Link href="#pricing" className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-md bg-transparent text-white border border-white/30 hover:bg-white/10 transition-colors">
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
