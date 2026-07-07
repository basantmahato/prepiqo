import { useEffect } from 'react';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import { Platform, Alert } from 'react-native';

export const usePlayStoreUpdate = () => {
  useEffect(() => {
    // Only check for updates in a real environment on Android
    if (!__DEV__ && Platform.OS === 'android') {
      const inAppUpdates = new SpInAppUpdates(
        false // isDebug
      );

      inAppUpdates.checkNeedsUpdate().then((result) => {
        if (result.shouldUpdate) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available on the Play Store.',
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Update',
                onPress: () => {
                  inAppUpdates.startUpdate({
                    updateType: IAUUpdateKind.FLEXIBLE, // Flexible allows background downloading
                  });
                }
              }
            ]
          );
        }
      }).catch(err => {
        console.log('Error checking for in-app updates', err);
      });
    }
  }, []);
};
