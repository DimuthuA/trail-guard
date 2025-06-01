import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { uploadHikerData } from '../firebase/uploadService';
import { detectActivity, useActivityRecognizer } from '../modules/ActivityRecognizer';
import AccelerometerReader from './sensors/AccelerometerReader';
import BatteryReader from './sensors/BatteryReader';
import LocationReader from './sensors/LocationReader';

export default function ActivityScreen() {
  const [acc, setAcc] = useState({});
  const { activity, updateActivity } = useActivityRecognizer();
  const [loc, setLoc] = useState({});
  const [battery, setBattery] = useState(null);
  const [activityState, setActivityState] = useState({
    label: 'unknown',
    startTime: Date.now(),
  });

  const localMags = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const durationMs = now - activityState.startTime;
      const minutes = Math.floor(durationMs / 60000);

      const coords = {
        latitude: loc?.latitude,
        longitude: loc?.longitude,
      };

      uploadHikerData("hiker123", {
        activity: `${activityState.label} for ${minutes} minutes`,
        battery: battery,
        location: `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
      });
    }, 600000); // Every 10 min

    return () => clearInterval(interval);
  }, [activityState, battery, loc]);



  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Activity Recognition</Text> */}
      <Text style={styles.title}>Activity: {activity}</Text>
      <Text style={styles.label}>x: {acc.x?.toFixed(2)} y: {acc.y?.toFixed(2)} z: {acc.z?.toFixed(2)}</Text>
      {/* <Text style={styles.label}>y: {acc.y?.toFixed(2)}</Text>
      <Text style={styles.label}>z: {acc.z?.toFixed(2)}</Text> */}

      <AccelerometerReader
        onData={(data) => {
          setAcc(data);
          const newLabel = detectActivity(data, localMags);
          if (newLabel !== activityState.label) {
            setActivityState({
              label: newLabel,
              startTime: Date.now(),
            });
          }
          updateActivity(data); // update global if needed
        }}

      />
      <LocationReader onLocation={setLoc}/>
      <BatteryReader onData={setBattery} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, margin: 10 },
  title: { fontSize: 24, color: '#000', marginBottom: 20 },
  label: { fontSize: 16, color: '#ccc', marginBottom: 10, paddingTop: 10 },
});
