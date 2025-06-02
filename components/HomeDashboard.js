import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import colors from '../constants/colors';
import { startBackgroundTask, stopBackgroundTask } from '../modules/backgroundTasks';
import { requestLocationPermissions } from '../modules/permissions';

export default function HomeScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const notificationIdRef = useRef(null);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestNotificationPermissions();
  }, []);


  const handleToggleTracking = async () => {
    if (isProcessing) return; // Prevent re-entry
    setIsProcessing(true);

    try {
      if (isTracking) {
        await stopBackgroundTask();
        if (notificationIdRef.current) {
          await Notifications.dismissNotificationAsync(notificationIdRef.current);
          notificationIdRef.current = null;
        }
        setIsTracking(false);
      } else {
        // Request location permissions first
        const granted = await requestLocationPermissions();
        if (!granted) {
          Alert.alert(
            'Permission Denied',
            'Location permission is needed for TrailGuard to track your activity. Please enable it in settings.'
          );
          return;
        }

        await startBackgroundTask();
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'TrailGuard is tracking your activity',
            body: 'Tracking continues in the background.',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null,
        });
        notificationIdRef.current = id;
        setIsTracking(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to toggle tracking');
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TrailGuard!</Text>
      <Text style={styles.subtitle}>
        Your trusty companion in safe and adventurous hikes
      </Text>

      <View style={styles.instructionsBox}>
        <Text style={styles.instructions}>
          To start tracking your hike, press the “Start Tracking” button below.
        </Text>
        <Text style={styles.instructions}>
          Add your emergency contacts in the Settings tab before you start.
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleToggleTracking}
        activeOpacity={0.8}
        disabled={isProcessing}
        style={[
          styles.button,
          { 
            backgroundColor: isTracking ? '#444' : '#4caf50',
            opacity: isProcessing ? 0.5 : 1,
          },
        ]}
      >
      <Text style={styles.buttonText}>
        {isProcessing
          ? 'Please wait...'
          : isTracking
          ? 'Stop Tracking'
          : 'Start Tracking'}
      </Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>
        Status: {isTracking ? 'Tracking your movement' : 'Tracking not activated'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: colors.secondaryTextColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.secondaryTextColor,
    marginBottom: 128,
    textAlign: 'center',
  },
  instructionsBox: {
    marginBottom: 48,
    paddingHorizontal: 12,
  },
  instructions: {
    fontSize: 16,
    color: colors.warningTextColor,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    borderRadius: 100,
    paddingVertical: 32,
    paddingHorizontal: 24,
    elevation: 10,
    shadowColor: '#444',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    color: colors.primaryTextColor,
    fontWeight: '600',
    textAlign: 'center'
  },
  statusText: {
    fontSize: 14,
    color: colors.statusTextColor,
    marginTop: 0,
    textAlign: 'center',
  },
});
