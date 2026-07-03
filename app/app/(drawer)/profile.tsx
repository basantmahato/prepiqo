import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user } = useAuthStore();

  const handleUpgrade = () => {
    // Placeholder for native Razorpay integration
    Alert.alert(
      "Upgrade to Pro",
      "Native payment integration (e.g. Razorpay) goes here. Would you like to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => console.log("Init Payment") }
      ]
    );
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9FAFB]">
        <Text>Loading...</Text>
      </View>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <ScrollView className="flex-1 bg-[#F9FAFB]" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-3xl font-bold text-[#0A2540] mb-6">My Profile</Text>

      {/* Main Container */}
      <View className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        
        {/* Header Section */}
        <View className="p-6 bg-gray-50 border-b border-gray-200 flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] flex justify-center items-center">
            <Text className="text-2xl font-bold text-[#5244E2]">{initial}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-[#0A2540]">{user.name}</Text>
            <Text className="text-[#6B7280] mt-1">{user.email}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View className="p-6">
          <Text className="text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            Account Details
          </Text>

          <View className="space-y-5 mb-8">
            <View>
              <Text className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Full Name</Text>
              <Text className="text-base font-medium text-[#0A2540] mt-1">{user.name}</Text>
            </View>
            <View>
              <Text className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email Address</Text>
              <Text className="text-base font-medium text-[#0A2540] mt-1">{user.email}</Text>
            </View>
            <View>
              <Text className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Account ID</Text>
              <Text className="text-sm font-mono text-[#6B7280] mt-1">{user._id || 'N/A'}</Text>
            </View>
          </View>

          <Text className="text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            Billing & Plan
          </Text>

          <View className="bg-[#F9FAFB] rounded-xl p-5 border border-gray-200">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="shield-checkmark-outline" size={20} color="#5244E2" />
              <Text className="font-semibold text-[#0A2540]">Current Subscription</Text>
            </View>

            <View className="self-start px-2 py-0.5 rounded-full bg-green-100 mb-2">
              <Text className="text-xs font-medium text-green-800">
                {user.currentSubscription ? 'Pro Plan Active' : 'Active'}
              </Text>
            </View>

            <Text className="text-lg font-bold text-[#0A2540] mb-2">
              {user.currentSubscription ? 'Pro Plan' : 'Hobby (Free)'}
            </Text>

            <Text className="text-sm text-[#6B7280] mb-5 leading-5">
              {user.currentSubscription 
                ? 'You are on the Pro plan with unlimited MCQ generation.' 
                : 'You are currently on the free Hobby plan. Upgrade to Pro to unlock unlimited MCQ generation and PDF exports.'}
            </Text>

            {!user.currentSubscription && (
              <TouchableOpacity 
                onPress={handleUpgrade}
                className="w-full py-3 bg-[#5244E2] rounded-lg items-center shadow-sm"
              >
                <Text className="text-white font-semibold text-sm">Upgrade to Pro</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
