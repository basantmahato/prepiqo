import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-24">
        <h1 className="text-4xl font-bold text-text-primary mb-8 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-text-secondary">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, password, and other information you choose to provide.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, such as to administer your account, process transactions, and provide customer support. We may also use the information to send you technical notices, updates, security alerts, and support and administrative messages.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">3. Data Security</h2>
          <p className="mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">4. Cookies</h2>
          <p className="mb-4">We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

          <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
