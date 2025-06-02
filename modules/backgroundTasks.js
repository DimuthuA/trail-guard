// backgroundLocation.js
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const TASK_NAME = 'trailguard-location-tracking';

// Define the background task
TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Location Task Error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('Location update received:', locations);
    // Add logic to save/send the location if needed
  }
});

// Start background location tracking with a foreground notification
export async function startBackgroundTask() {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Location permission not granted');
    return;
  }

  const isRunning = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  if (!isRunning) {
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 60000,          // 1 minute
      distanceInterval: 0,          // every timeInterval
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'TrailGuard Active',
        notificationBody: 'Tracking your location in the background.',
        notificationColor: '#FF0000',
        notificationChannelId: 'background',
      },
    });
    console.log('Background location tracking started');
  }
}

// Stop background task
export async function stopBackgroundTask() {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(TASK_NAME);
    console.log('Background location tracking stopped');
  }
}

// Check if task is running
export async function isBackgroundTaskRunning() {
  return await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
}
