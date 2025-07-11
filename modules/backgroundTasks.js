import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { uploadHikerData } from '../firebase/uploadService';
import { withTimeout } from '../utils/asyncUtils';
import { getSLTTimestamp } from '../utils/timeUtils';

const TASK_NAME = 'trailguard-location-tracking';

// Define the background task
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(`[backgroundTasks] Location Task Error @ SLT: ${getSLTTimestamp()}\n`, error);
    return;
  }
  if (data) {
    const { locations } = data;
    const timestampUTC = new Date().toISOString();
    const timestampSLT = getSLTTimestamp();
    let batteryLevel = null;
    try {
      batteryLevel = await withTimeout(getBatteryLevel(), 2000); // 2 seconds timeout
    } catch (error) {
      console.warn(`[backgroundTasks] Failed to get battery level or timeout @ SLT: ${timestampSLT}\n`, error);
      batteryLevel = -1; // fallback
    }

    console.log(`[backgroundTasks] Update @ SLT: ${timestampSLT}\nLocation: `, locations, '\nBattery: ', batteryLevel);
    
    const userId = 'hikerDimuthu'; // Replace with actual user ID logic

    try {
      for (const location of locations) {
        // Send each location update to Firestore
        await uploadHikerData(userId, {
          coords: location.coords,
          mocked: location.mocked,
          timestamp: location.timestamp,
          batteryLevel: batteryLevel,
          updatedAtUTC: timestampUTC,
          updatedAtSLT: timestampSLT,
        });
      }
    } catch (uploadError) {
      console.error('[backgroundTasks] Error uploading location:', uploadError);
    }
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
      timeInterval: 120000,          // 2 minutes
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

async function getBatteryLevel() {
  const level = await Battery.getBatteryLevelAsync(); // float between 0 and 1
  const percentage = Math.round(level * 100);         // integer between 0 and 100
  return percentage;
}