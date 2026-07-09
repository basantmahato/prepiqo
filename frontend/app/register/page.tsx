'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ text: '', type: '' });
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Get state and actions from Zustand store
  const { register, googleLogin, isLoading, error, isAuthenticated, clearError, setAuth } = useAuthStore();

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register({ name, email, password });
      if (response && response.requiresVerification) {
        setRegisteredEmail(response.email);
        setShowOtpModal(true);
      }
    } catch (err) {
      // Error is handled and stored in Zustand
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setOtpMessage({ text: 'Please enter a valid 6-digit OTP.', type: 'error' });
      return;
    }

    setOtpIsLoading(true);
    setOtpMessage({ text: '', type: '' });

    try {
      const response = await api.post('/auth/verify-registration', { email: registeredEmail, otp });
      setOtpMessage({ text: 'Verification successful!', type: 'success' });
      
      setTimeout(() => {
        const { token, ...userData } = response.data;
        setAuth(userData, token);
        // Redirection is handled by the useEffect above
      }, 1000);
    } catch (error: any) {
      setOtpMessage({ 
        text: error.response?.data?.message || 'Failed to verify OTP.', 
        type: 'error' 
      });
    } finally {
      setOtpIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpMessage({ text: 'Sending new code...', type: '' });
    try {
      await api.post('/auth/resend-verification', { email: registeredEmail });
      setOtpMessage({ text: 'A new code has been sent to your email.', type: 'success' });
    } catch (error: any) {
      setOtpMessage({ 
        text: error.response?.data?.message || 'Failed to resend OTP.', 
        type: 'error' 
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);
      // Redirection is handled by the useEffect above
    } catch (err) {
      // Error is handled and stored in Zustand
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
        
        <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">Create an account</h1>
        <p className="text-text-secondary text-sm text-center mb-8">Start generating high-quality MCQs instantly.</p>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-sm font-semibold mb-2 text-text-primary">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-lg text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="Jane Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="mb-5">
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
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-text-primary">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-lg text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg bg-brand text-white border border-transparent hover:bg-brand/90 transition-all shadow-sm disabled:opacity-50" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center text-center my-6 text-text-muted text-sm before:flex-1 before:border-b before:border-border-strong before:mr-2 after:flex-1 after:border-b after:border-border-strong after:ml-2">
          or
        </div>

        <div className="flex justify-center mt-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => { /* Error handling could be passed to a store action */ }}
            theme="outline"
            shape="rectangular"
            text="signup_with"
            width="100%"
          />
        </div>

        <div className="text-center mt-8 text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-brand font-semibold hover:underline">Log in</Link>
        </div>
        
        <div className="text-center mt-4">
          <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-primary transition-colors underline underline-offset-4">
            Skip for now
          </Link>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Verify Your Account</h2>
            <p className="text-sm text-text-secondary mb-6">
              We sent a 6-digit verification code to <span className="font-semibold text-text-primary">{registeredEmail}</span>. Please enter it below.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="123456" 
                  className="w-full p-2 border border-border-strong rounded-md text-center text-lg tracking-[0.5em] font-mono" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              {otpMessage.text && (
                <p className={`text-sm ${otpMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {otpMessage.text}
                </p>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <button 
                  onClick={handleVerifyOtp}
                  disabled={otpIsLoading || otp.length < 6}
                  className="w-full py-2.5 bg-brand text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-brand/90 transition-colors"
                >
                  {otpIsLoading ? 'Verifying...' : 'Verify Email'}
                </button>
                <button 
                  onClick={handleResendOtp}
                  disabled={otpIsLoading}
                  className="w-full py-2 bg-transparent text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
