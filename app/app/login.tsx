import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, isLoading, error: storeError, clearError, setAuth, googleLogin } = useAuthStore();

  const isExpoGo = Constants.appOwnership === 'expo';

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: isExpoGo ? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID : (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'dummy-android-client-id'),
    iosClientId: isExpoGo ? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID : (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'dummy-ios-client-id'),
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleAuth(authentication.idToken);
      }
    }
  }, [response]);

  const handleGoogleAuth = async (idToken: string) => {
    try {
      clearError();
      await googleLogin(idToken);
      router.replace('/(drawer)' as any);
    } catch (err) {
      console.log('Google login failed', err);
    }
  };

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ text: '', type: '' });

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    setLocalError('');
    clearError();
    
    try {
      await login({ email, password });
      router.replace('/(drawer)' as any);
    } catch (err: any) {
      if (err.response?.data?.requiresVerification) {
        setLocalError('');
        clearError();
        setShowOtpModal(true);
      } else {
        console.log('Login failed', err);
      }
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
      const res = await api.post('/auth/verify-registration', { email, otp });
      setOtpMessage({ text: 'Verification successful!', type: 'success' });
      
      const { token, ...userData } = res.data;
      await setAuth(userData, token);
      
      setTimeout(() => {
        setShowOtpModal(false);
        router.replace('/(drawer)' as any);
      }, 1000);
    } catch (err: any) {
      setOtpMessage({ 
        text: err.response?.data?.message || 'Verification failed', 
        type: 'error' 
      });
    } finally {
      setOtpIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    try {
      await api.post('/auth/resend-verification', { email });
      setOtpMessage({ text: 'OTP resent successfully!', type: 'success' });
    } catch (err: any) {
      setOtpMessage({ 
        text: err.response?.data?.message || 'Failed to resend OTP', 
        type: 'error' 
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-grow justify-center p-6" showsVerticalScrollIndicator={false}>
        
        <View className="w-full max-w-[420px] mx-auto py-8">
          <View className="flex-row justify-center items-center mb-6 gap-3">
            <View className="w-10 h-10 bg-[#5244E2] rounded-xl justify-center items-center shadow-sm">
              <Ionicons name="layers" size={24} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 tracking-tight">Prepiqo</Text>
          </View>
          

          <Text className="text-2xl font-bold text-center mb-2 text-[#0A2540]">Welcome back</Text>
          <Text className="text-sm text-gray-500 text-center mb-8">Log in to your account to continue.</Text>

          {(localError || storeError) ? <Text className="text-red-500 text-center mb-4 text-sm">{localError || storeError}</Text> : null}

          <View className="mb-5">
            <Text className="text-sm font-bold text-[#0A2540] mb-2">Email address</Text>
            <TextInput
              className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg px-4 py-3.5 text-sm text-gray-900"
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-bold text-[#0A2540]">Password</Text>
              <Link href="/forgotpassword" asChild>
                <TouchableOpacity>
                  <Text className="text-sm font-medium text-[#5244E2]">Forgot password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <TextInput
              className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg px-4 py-3.5 text-sm text-gray-900"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            className={`bg-[#5244E2] rounded-lg py-4 items-center justify-center mt-2 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-base font-bold">Log in</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="text-gray-400 px-4 text-sm">or</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <TouchableOpacity 
            className="border border-gray-200 rounded-lg py-3.5 items-center justify-center bg-white flex-row gap-3"
            onPress={() => promptAsync()}
            disabled={!request || isLoading}
          >
            <Image 
              source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} 
              style={{ width: 20, height: 20 }} 
            />
            <Text className="text-gray-600 text-sm font-medium">Continue with Google</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-sm text-gray-500">Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-sm font-medium text-[#5244E2]">Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <TouchableOpacity 
            onPress={() => router.replace('/(drawer)' as any)}
            className="mt-6 items-center justify-center"
          >
            <Text className="text-sm font-medium text-gray-500">Continue as Guest (Skip Login)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OTP Modal */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-sm">
            <Text className="text-xl font-bold text-[#0A2540] mb-2">Verify Your Account</Text>
            <Text className="text-sm text-gray-500 mb-6">
              We sent a 6-digit verification code to <Text className="font-semibold text-[#0A2540]">{email}</Text>. Please enter it below.
            </Text>

            <View className="mb-5">
              <Text className="text-sm font-bold text-[#0A2540] mb-2">Verification Code</Text>
              <TextInput
                className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg px-4 py-3 text-2xl text-gray-900 text-center tracking-[8px]"
                placeholder="123456"
                placeholderTextColor="#9ca3af"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {otpMessage.text ? (
              <Text className={`mt-2 text-sm text-center ${otpMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {otpMessage.text}
              </Text>
            ) : null}

            <View className="mt-2">
              <TouchableOpacity 
                className={`bg-[#5244E2] rounded-lg py-4 items-center justify-center mt-4 ${otpIsLoading ? 'opacity-70' : ''}`}
                onPress={handleVerifyOtp}
                disabled={otpIsLoading || otp.length < 6}
              >
                {otpIsLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-base font-bold">Verify Email</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="py-3 items-center mt-2"
                disabled={otpIsLoading}
                onPress={handleResendOtp}
              >
                <Text className="text-gray-500 text-sm font-medium">Didn't receive a code? Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}
