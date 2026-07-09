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
          <Link href="/" className="flex items-center justify-center gap-3 font-bold text-2xl text-text-primary tracking-tight">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center text-white shadow-md">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            Prepiqo
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
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-xl text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-sm" 
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
              className="w-full px-4 py-3 bg-bg-primary border border-border-strong rounded-xl text-text-primary text-sm transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-sm" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl bg-brand text-white hover:bg-brand/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50" disabled={isLoading}>
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
        
        <div className="text-center mt-4">
          <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-primary transition-colors underline underline-offset-4">
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
