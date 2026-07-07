import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { initIAP, getProducts, requestPurchase } from '../../lib/iapService';
import { Ionicons } from '@expo/vector-icons';

export default function SubscriptionScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    setupIAP();
  }, []);

  const setupIAP = async () => {
    try {
      const initialized = await initIAP();
      if (initialized) {
        const availableProducts = await getProducts();
        setProducts(availableProducts || []);
      } else {
        Alert.alert('Error', 'Failed to initialize in-app purchases.');
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sku: string) => {
    setPurchasing(true);
    try {
      // We pass a dummy planId 'plan_123' for now. 
      // In a real scenario, this would come from your backend plans list.
      const purchase = await requestPurchase(sku, 'plan_123');
      if (purchase) {
        Alert.alert('Success!', 'Thank you for your purchase. Your account has been upgraded.');
      }
    } catch (error: any) {
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Purchase Failed', error.message || 'An error occurred during purchase.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#5244E2" />
        <Text className="mt-4 text-gray-500">Loading plans...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F9FAFB] p-4">
      <View className="items-center mb-8 mt-4">
        <View className="w-16 h-16 rounded-full bg-[#E0E7FF] items-center justify-center mb-4">
          <Ionicons name="star" size={32} color="#5244E2" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 text-center">Upgrade to Premium</Text>
        <Text className="text-gray-500 text-center mt-2 px-4">
          Get unlimited access to all courses, mock tests, and personalized analytics.
        </Text>
      </View>

      {products.length === 0 ? (
        <View className="bg-white p-6 rounded-xl border border-gray-200 items-center">
          <Ionicons name="information-circle-outline" size={32} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-4">
            No subscription plans are currently available in the App Store for your region, or products haven't been created in the Developer Console yet.
          </Text>
        </View>
      ) : (
        products.map((product: any) => (
          <View key={product.productId} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-800">{product.title || product.name}</Text>
            <Text className="text-gray-500 mt-1 mb-4">{product.description}</Text>
            
            <View className="flex-row items-baseline mb-6">
              <Text className="text-3xl font-extrabold text-[#5244E2]">{product.localizedPrice}</Text>
              <Text className="text-gray-500 ml-1">/ {product.subscriptionPeriod || 'month'}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handlePurchase(product.productId)}
              disabled={purchasing}
              className={`w-full py-3 rounded-lg flex-row justify-center items-center ${purchasing ? 'bg-[#A39CF0]' : 'bg-[#5244E2]'}`}
            >
              {purchasing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-lg">Subscribe Now</Text>
              )}
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Fallback mock UI for development testing if no real products load */}
      {products.length === 0 && __DEV__ && (
        <View className="mt-8">
          <Text className="text-gray-400 text-xs text-center mb-2">DEVELOPMENT MOCK UI</Text>
          <View className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-800">Pro Plan (Mock)</Text>
            <Text className="text-gray-500 mt-1 mb-4">Unlock everything. Billed monthly.</Text>
            
            <View className="flex-row items-baseline mb-6">
              <Text className="text-3xl font-extrabold text-[#5244E2]">$9.99</Text>
              <Text className="text-gray-500 ml-1">/ month</Text>
            </View>

            <TouchableOpacity
              onPress={() => Alert.alert("Dev Mode", "You need real App Store/Play Store products to test this.")}
              className="w-full py-3 rounded-lg flex-row justify-center items-center bg-[#5244E2]"
            >
              <Text className="text-white font-bold text-lg">Subscribe Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
