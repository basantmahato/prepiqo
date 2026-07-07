import * as StoreReview from 'expo-store-review';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_REVIEW_PROMPT_DATE_KEY = '@last_review_prompt_date';
const DAYS_BETWEEN_PROMPTS = 30; // Wait 30 days between automatic prompts

export const useStoreReview = () => {
  const requestReviewIfAppropriate = async () => {
    try {
      if (!(await StoreReview.hasAction())) {
        return; // Store review not available on this device/environment
      }

      const lastPromptDateStr = await AsyncStorage.getItem(LAST_REVIEW_PROMPT_DATE_KEY);
      
      if (lastPromptDateStr) {
        const lastPromptDate = new Date(lastPromptDateStr);
        const daysSinceLastPrompt = (Date.now() - lastPromptDate.getTime()) / (1000 * 3600 * 24);
        
        if (daysSinceLastPrompt < DAYS_BETWEEN_PROMPTS) {
          // Don't prompt yet, too soon
          return;
        }
      }

      // Prompt for review
      await StoreReview.requestReview();
      await AsyncStorage.setItem(LAST_REVIEW_PROMPT_DATE_KEY, new Date().toISOString());

    } catch (error) {
      console.log('Error requesting store review', error);
    }
  };

  const manualRequestReview = async () => {
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        Alert.alert(
          'Store Review Unavailable', 
          Platform.OS === 'android' 
            ? 'Please rate us on the Google Play Store.' 
            : 'Please rate us on the App Store.'
        );
      }
    } catch (error) {
      console.log('Error manually requesting store review', error);
    }
  };

  return { requestReviewIfAppropriate, manualRequestReview };
};
