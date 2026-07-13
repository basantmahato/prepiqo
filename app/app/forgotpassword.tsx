import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../lib/axios';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-[#F9FAFB]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-grow justify-center p-6" showsVerticalScrollIndicator={false}>
        
        <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mx-auto w-full max-w-[420px]">
          <View className="flex-row justify-center items-center mb-8 gap-3">
            <View className="w-10 h-10 bg-[#5244E2] rounded-xl justify-center items-center shadow-sm">
              <Ionicons name="layers" size={24} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 tracking-tight">Prepiqo</Text>
          </View>
          
          <Text className="text-2xl font-bold text-center mb-2 text-[#0A2540]">Reset password</Text>
          <Text className="text-sm text-gray-500 text-center mb-8">Enter your email and we'll send you a link to reset your password.</Text>

          {error ? <Text className="text-red-500 text-center mb-4 text-sm">{error}</Text> : null}

          {!success ? (
            <>
              <View className="mb-6">
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

              <TouchableOpacity 
                className={`bg-[#5244E2] rounded-lg py-4 items-center justify-center ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-base font-bold">Send reset link</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                <Text className="text-green-700 font-bold">Check your email</Text>
              </View>
              <Text className="text-green-600 text-sm">
                We've sent a password reset link to <Text className="font-bold">{email}</Text>.
              </Text>
            </View>
          )}

          <View className="flex-row justify-center items-center mt-8">
            <Link href="/login" asChild>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Ionicons name="arrow-back" size={16} color="#5244E2" />
                <Text className="text-sm font-medium text-[#5244E2]">Back to login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
