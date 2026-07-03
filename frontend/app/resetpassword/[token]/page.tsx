'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/axios';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const resetToken = params.token as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.put(`/auth/resetpassword/${resetToken}`, {
        password,
      });
      setMessage('Password reset successfully! Redirecting...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired reset token');
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
            MCQBot
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">Create new password</h1>
        <p className="text-text-secondary text-sm text-center mb-8">Your new password must be different from previous used passwords.</p>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        {message && <div className="text-emerald-500 text-sm mb-4 text-center p-2 bg-emerald-500/10 border border-emerald-500/50 rounded-md">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-text-primary">New Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-lg text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-text-primary">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-lg text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>
          
          <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg bg-brand text-white border border-transparent hover:bg-brand/90 transition-all shadow-sm disabled:opacity-50" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
