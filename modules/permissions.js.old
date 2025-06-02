import * as Location from 'expo-location';
import { Alert } from 'react-native';

export async function requestLocationPermissions() {
  // Request foreground location permission
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();

  if (fgStatus !== 'granted') {
    Alert.alert('Permission required', 'Foreground location permission is needed to proceed.');
    return false;
  }

  // Then request background location permission
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

  if (bgStatus !== 'granted') {
    Alert.alert(
      'Enable background location manually',
      'Please go to Settings > Apps > Trail Guard > Permissions > Location and choose "Allow all the time".'
    );
    return false;
  }

  return true;
}
