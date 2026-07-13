'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgotpassword', {
        email
      });
      setMessage('Success! Check your email for a password reset link.');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-bg-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-[420px] bg-white border border-border-subtle rounded-2xl p-8 sm:p-10 shadow-xl relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-text-primary">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            Prepiqo
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">Reset Password</h1>
        <p className="text-text-secondary text-sm text-center mb-8">Enter your email address and we'll send you a link to reset your password.</p>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        {message && <div className="text-emerald-500 text-sm mb-4 text-center p-2 bg-emerald-500/10 border border-emerald-500/50 rounded-md">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-text-primary">Email address</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-lg text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg bg-brand text-white border border-transparent hover:bg-brand/90 transition-all shadow-sm disabled:opacity-50" disabled={loading}>
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-text-secondary">
          Remember your password? <Link href="/login" className="text-brand font-semibold hover:underline">Back to log in</Link>
        </div>
      </div>
    </div>
  );
}
