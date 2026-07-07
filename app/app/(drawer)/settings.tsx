import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import api from '../../lib/axios';
import { useStoreReview } from '../../hooks/useStoreReview';

export default function SettingsScreen() {
  const { user, updateUser } = useAuthStore();
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileIsLoading, setProfileIsLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  // Store Review hook
  const { manualRequestReview } = useStoreReview();

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

  // Notifications state
  const [marketingEmails, setMarketingEmails] = useState(false);

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
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 bg-[#F9FAFB]" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-3xl font-bold text-[#0A2540] mb-6">Settings</Text>

        {/* Profile Settings */}
        <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <View className="p-5 bg-gray-50 border-b border-gray-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-[#0A2540]">Profile</Text>
            </View>
            <Text className="text-sm text-[#6B7280] mt-1">Manage your public profile information.</Text>
          </View>
          
          <View className="p-5 space-y-4">
            <View>
              <Text className="text-sm font-medium text-[#0A2540] mb-1">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="w-full p-3 border border-gray-300 rounded-lg text-[#1F2937]"
                placeholder="John Doe"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-[#0A2540] mb-1">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full p-3 border border-gray-300 rounded-lg text-[#1F2937]"
                placeholder="john@example.com"
              />
            </View>

            {profileMessage.text ? (
              <Text className={`text-sm mt-1 ${profileMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {profileMessage.text}
              </Text>
            ) : null}

            <TouchableOpacity 
              onPress={handleUpdateProfile}
              disabled={profileIsLoading || !name || !email || (user ? (name === user.name && email === user.email) : false)}
              className={`px-4 py-3 rounded-lg self-start mt-2 ${profileIsLoading || !name || !email || (user ? (name === user.name && email === user.email) : false) ? 'bg-[#9CA3AF]' : 'bg-[#111827]'}`}
            >
              {profileIsLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-medium">Save Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Settings */}
        <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <View className="p-5 bg-gray-50 border-b border-gray-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-[#0A2540]">Security</Text>
            </View>
            <Text className="text-sm text-[#6B7280] mt-1">Manage your password and security preferences.</Text>
          </View>
          
          <View className="p-5 space-y-4">
            <View>
              <Text className="text-sm font-medium text-[#0A2540] mb-1">Current Password</Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                className="w-full p-3 border border-gray-300 bg-[#EEF2FF] rounded-lg text-[#1F2937]"
                placeholder="••••••••"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-[#0A2540] mb-1">New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="w-full p-3 border border-gray-300 rounded-lg text-[#1F2937]"
                placeholder="••••••••"
              />
            </View>

            {message.text ? (
              <Text className={`text-sm mt-1 ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {message.text}
              </Text>
            ) : null}

            <TouchableOpacity 
              onPress={handleUpdatePassword}
              disabled={isLoading || !currentPassword || !newPassword}
              className={`px-4 py-3 rounded-lg self-start mt-2 ${isLoading || !currentPassword || !newPassword ? 'bg-[#9CA3AF]' : 'bg-[#6B7280]'}`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-medium">Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Preferences */}
        <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <View className="p-5 bg-gray-50 border-b border-gray-200">
            <View className="flex-row items-center gap-2">
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-[#0A2540]">Notifications</Text>
            </View>
            <Text className="text-sm text-[#6B7280] mt-1">Choose what we email you about.</Text>
          </View>
          
          <View className="p-5">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text className="font-medium text-[#0A2540]">Marketing Emails</Text>
                <Text className="text-sm text-[#6B7280] mt-1">Receive emails about new features and updates.</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#5244E2' }}
                thumbColor={'#FFFFFF'}
                onValueChange={setMarketingEmails}
                value={marketingEmails}
              />
            </View>
          </View>
        </View>

      </ScrollView>

      {/* App Feedback */}
      <View className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 mx-4">
        <View className="p-5 bg-gray-50 border-b border-gray-200">
          <View className="flex-row items-center gap-2">
            <Ionicons name="star-outline" size={20} color="#6B7280" />
            <Text className="text-lg font-semibold text-[#0A2540]">Feedback</Text>
          </View>
          <Text className="text-sm text-[#6B7280] mt-1">Help us improve by leaving a review.</Text>
        </View>
        <View className="p-5">
          <TouchableOpacity 
            onPress={() => manualRequestReview()}
            className="flex-row items-center justify-between py-2"
          >
            <View>
              <Text className="font-medium text-[#0A2540]">Rate the App</Text>
              <Text className="text-sm text-[#6B7280]">Leave a review on the app store</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <Text className="text-xl font-bold text-[#0A2540] mb-2">Verify Email Change</Text>
            <Text className="text-sm text-[#6B7280] mb-6">
              We sent a 6-digit verification code to your new email address. Please enter it below to confirm the change.
            </Text>
            
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-[#0A2540] mb-1">Verification Code</Text>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                  keyboardType="number-pad"
                  placeholder="123456"
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl tracking-[0.5em] font-mono text-[#0A2540]"
                />
              </View>

              {otpMessage.text ? (
                <Text className={`text-sm ${otpMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {otpMessage.text}
                </Text>
              ) : null}

              <View className="flex-row gap-3 justify-end mt-4">
                <TouchableOpacity 
                  onPress={() => setShowOtpModal(false)}
                  disabled={otpIsLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg justify-center"
                >
                  <Text className="text-[#374151] font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleVerifyOtp}
                  disabled={otpIsLoading || otp.length < 6}
                  className={`px-4 py-2 rounded-lg justify-center flex-row ${otpIsLoading || otp.length < 6 ? 'bg-[#5244E2] opacity-50' : 'bg-[#5244E2]'}`}
                >
                  {otpIsLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-medium">Verify</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
