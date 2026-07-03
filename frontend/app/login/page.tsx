'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Get state and actions from Zustand store
  const { login, googleLogin, isLoading, error, isAuthenticated, clearError } = useAuthStore();

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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirection is handled by the useEffect above
    } catch (err) {
      // Error is handled and stored in Zustand
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
        
        <h1 className="text-2xl font-bold text-center mb-2 text-text-primary">Welcome back</h1>
        <p className="text-text-secondary text-sm text-center mb-8">Log in to your account to continue.</p>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleEmailLogin}>
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
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-sm font-semibold text-text-primary m-0">Password</label>
              <Link href="/forgotpassword" className="text-xs font-medium text-brand hover:text-brand/80 transition-colors">Forgot password?</Link>
            </div>
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
            {isLoading ? 'Logging in...' : 'Log in'}
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
            text="continue_with"
            width="100%"
          />
        </div>

        <div className="text-center mt-8 text-sm text-text-secondary">
          Don't have an account? <Link href="/register" className="text-brand font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
