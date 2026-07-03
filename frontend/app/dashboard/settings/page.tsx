'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import api from '../../../lib/axios';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileIsLoading, setProfileIsLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ text: '', type: '' });

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      setProfileMessage({ text: 'Please fill in both name and email.', type: 'error' });
      return;
    }
    
    setProfileIsLoading(true);
    setProfileMessage({ text: '', type: '' });

    try {
      const response = await api.put('/auth/profile', { name, email });
      
      if (response.data.requiresOtp) {
        setProfileMessage({ text: response.data.message, type: 'success' });
        setShowOtpModal(true);
      } else {
        setProfileMessage({ text: response.data.message || 'Profile updated successfully.', type: 'success' });
        updateUser(response.data);
      }
    } catch (error: any) {
      setProfileMessage({ 
        text: error.response?.data?.message || 'Failed to update profile.', 
        type: 'error' 
      });
    } finally {
      setProfileIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpMessage({ text: 'Please enter the OTP.', type: 'error' });
      return;
    }

    setOtpIsLoading(true);
    setOtpMessage({ text: '', type: '' });

    try {
      const response = await api.put('/auth/verify-email', { otp });
      setOtpMessage({ text: 'Email verified successfully!', type: 'success' });
      updateUser(response.data);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowOtpModal(false);
        setOtp('');
        setOtpMessage({ text: '', type: '' });
      }, 1500);

    } catch (error: any) {
      setOtpMessage({ 
        text: error.response?.data?.message || 'Failed to verify OTP.', 
        type: 'error' 
      });
    } finally {
      setOtpIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ text: 'Please fill in both fields.', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      setMessage({ text: response.data.message || 'Password updated successfully.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update password.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">

        {/* Profile Settings */}
        <section className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-bg-secondary">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Profile
            </h2>
            <p className="text-sm text-text-secondary mt-1">Manage your public profile information.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full max-w-md p-2 border border-border-strong rounded-md" 
                aria-label="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                className="w-full max-w-md p-2 border border-border-strong rounded-md" 
                aria-label="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {profileMessage.text && (
              <p className={`text-sm mt-2 ${profileMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {profileMessage.text}
              </p>
            )}

            <button 
              onClick={handleUpdateProfile}
              disabled={profileIsLoading || !name || !email}
              className="px-4 py-2 bg-text-primary text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
            >
              {profileIsLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </section>
        
        {/* Security Settings */}
        <section className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-bg-secondary">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Security
            </h2>
            <p className="text-sm text-text-secondary mt-1">Manage your password and security preferences.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full max-w-md p-2 border border-border-strong rounded-md" 
                aria-label="Current Password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full max-w-md p-2 border border-border-strong rounded-md" 
                aria-label="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            {message.text && (
              <p className={`text-sm mt-2 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}

            <button 
              onClick={handleUpdatePassword}
              disabled={isLoading || !currentPassword || !newPassword}
              className="px-4 py-2 bg-text-primary text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-bg-secondary">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              Notifications
            </h2>
            <p className="text-sm text-text-secondary mt-1">Choose what we email you about.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-text-secondary">Receive emails about new features and updates.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" aria-label="Toggle Marketing Emails" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
          </div>
        </section>
        
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Verify Email Change</h2>
            <p className="text-sm text-text-secondary mb-6">
              We sent a 6-digit verification code to your new email address. Please enter it below to confirm the change.
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

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setShowOtpModal(false)}
                  className="px-4 py-2 border border-border-strong rounded-md text-sm font-medium hover:bg-gray-50"
                  disabled={otpIsLoading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVerifyOtp}
                  disabled={otpIsLoading || otp.length < 6}
                  className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium disabled:opacity-50 hover:bg-brand/90"
                >
                  {otpIsLoading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
