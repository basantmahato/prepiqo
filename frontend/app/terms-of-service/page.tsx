import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-24">
        <h1 className="text-4xl font-bold text-text-primary mb-8 tracking-tight">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-text-secondary">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">2. Provision of Services</h2>
          <p className="mb-4">You agree and acknowledge that we are entitled to modify, improve or discontinue any of our services at its sole discretion and without notice to you even if it may result in you being prevented from accessing any information contained in it. Furthermore, you agree and acknowledge that we are entitled to provide services to you through subsidiaries or affiliated entities.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">3. Proprietary Rights</h2>
          <p className="mb-4">You acknowledge and agree that our services may contain proprietary and confidential information including trademarks, service marks and patents protected by intellectual property laws and international intellectual property treaties. Our content may not be sold, reproduced, or distributed without our written permission.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">4. Termination of Agreement</h2>
          <p className="mb-4">The Terms of this agreement will continue to apply in perpetuity until terminated by either party without notice at any time for any reason. Terms that are to continue in perpetuity shall be unaffected by the termination of this agreement.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms of Service, please contact us.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
