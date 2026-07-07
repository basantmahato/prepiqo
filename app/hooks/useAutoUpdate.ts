import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';
import { Alert } from 'react-alert'; // We can use React Native Alert

// Using standard React Native Alert for simplicity
import { Alert as RNAlert } from 'react-native';

export const useAutoUpdate = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check for updates automatically on app mount
    if (!__DEV__) {
      checkForUpdates();
    }
  }, []);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setUpdateAvailable(true);
        // Prompt user to download
        RNAlert.alert(
          'Update Available',
          'A new version of the app is available. Would you like to update now?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Update', onPress: downloadAndInstallUpdate }
          ]
        );
      }
    } catch (error) {
      console.log('Error checking for updates:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadAndInstallUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      RNAlert.alert(
        'Update Downloaded',
        'The app will now restart to apply the update.',
        [{ text: 'OK', onPress: () => Updates.reloadAsync() }]
      );
    } catch (error) {
      console.log('Error downloading update:', error);
      RNAlert.alert('Error', 'Failed to download the update. Please try again later.');
    }
  };

  return { isChecking, updateAvailable, checkForUpdates };
};
