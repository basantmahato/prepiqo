import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Assuming this is used for auth token

let RNIap;
try {
  RNIap = require('react-native-iap');
} catch (err) {
  console.log('react-native-iap is not supported in this environment (e.g. Expo Go):', err.message);
}

const itemSKUs = Platform.select({
  ios: [
    'com.prepiqo.app.course1', // Replace with your actual iOS product IDs
    'com.prepiqo.app.subscription1'
  ],
  android: [
    'com.prepiqo.app.course1', // Replace with your actual Android product IDs
    'com.prepiqo.app.subscription1'
  ],
});

export const initIAP = async () => {
  if (!RNIap) {
    console.log('IAP is not available in this environment');
    return false;
  }
  try {
    const init = await RNIap.initConnection();
    if (init) {
      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
      return true;
    }
  } catch (err) {
    console.warn('IAP Init Error:', err);
  }
  return false;
};

export const getProducts = async () => {
  if (!RNIap) {
    console.log('IAP is not available in this environment');
    return [];
  }
  try {
    const products = await RNIap.getProducts({ skus: itemSKUs });
    return products;
  } catch (err) {
    console.warn('IAP Get Products Error:', err);
    return [];
  }
};

export const requestPurchase = async (sku, planId) => {
  if (!RNIap) {
    console.log('IAP is not available in this environment');
    throw new Error('In-app purchases are not supported in Expo Go. Please use a development build.');
  }
  try {
    const purchase = await RNIap.requestPurchase({ sku });
    
    // Once purchase is successful locally, verify with backend
    await verifyPurchaseWithBackend(purchase, planId);
    
    // Finish the transaction so the user is not charged again / receipt is consumed
    await RNIap.finishTransaction({ purchase, isConsumable: false });
    
    return purchase;
  } catch (err) {
    console.warn('IAP Request Purchase Error:', err);
    throw err;
  }
};

const verifyPurchaseWithBackend = async (purchase, planId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const endpoint = Platform.OS === 'ios' 
      ? '/api/v1/iap/verify-apple' 
      : '/api/v1/iap/verify-google';

    const payload = Platform.OS === 'ios' 
      ? {
          receiptData: purchase.transactionReceipt,
          planId,
          transactionId: purchase.transactionId
        }
      : {
          purchaseToken: purchase.purchaseToken,
          productId: purchase.productId,
          planId,
          transactionId: purchase.transactionId
        };

    // Replace with your actual backend URL or use an env variable
    const response = await axios.post(`http://localhost:5001${endpoint}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      console.log('Purchase successfully verified on backend');
    }
  } catch (error) {
    console.error('Backend verification failed:', error);
    // You might want to handle retries here if the backend is temporarily down
  }
};
