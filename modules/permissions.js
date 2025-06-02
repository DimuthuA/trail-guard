import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export async function requestLocationPermissions() {
  // Request foreground location
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();

  if (fgStatus !== 'granted') {
    Alert.alert('Permission required', 'Foreground location permission is needed to proceed.');
    return false;
  }

  // Request background location (Android only)
  if (Platform.OS === 'android') {
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

    if (bgStatus !== 'granted') {
      Alert.alert(
        'Background location needed',
        'To enable background tracking, allow "All the time" location access from app settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Go To Settings',
            onPress: () => {
              if (Platform.Version >= 30) {
                // Android 11+
                IntentLauncher.startActivityAsync(
                  IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                  { data: `package:${Application.applicationId}` }
                );
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return false;
    }

    // Check if battery optimization is enabled
    try {
      const isOptimized = await DeviceInfo.isBatteryOptimizationEnabled();
      if (isOptimized) {
        Alert.alert(
          'Battery Optimization',
          'To ensure the app works reliably in the background, please disable battery optimizations for this app.',
          [
            {
              text: 'Skip',
              style: 'cancel',
            },
            {
              text: 'Go To Settings',
              onPress: () => {
                if (Platform.Version >= 23) {
                  IntentLauncher.startActivityAsync(
                    IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS
                  );
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.warn('Battery optimization check failed:', error);
    }
  }

  return true;
}
