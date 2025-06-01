import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { uploadHikerData } from '../firebase/uploadService';
import { detectActivity, useActivityRecognizer } from '../modules/ActivityRecognizer';
import AccelerometerReader from './sensors/AccelerometerReader';
import BarometerReader from './sensors/BarometerReader';
import BatteryReader from './sensors/BatteryReader';
import GyroscopeReader from './sensors/GyroscopeReader';
import LocationReader from './sensors/LocationReader';
import SignalReader from './sensors/SignalReader';

export default function ActivityScreen() {
  const [acc, setAcc] = useState({});
  const { activity, updateActivity } = useActivityRecognizer();
  const [loc, setLoc] = useState({});
  const [battery, setBattery] = useState(null);
  const [gyro, setGyro] = useState({});
  const [steps, setSteps] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [signal, setSignal] = useState(null);
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
      <Text style={styles.label}>Accel: x= {acc.x?.toFixed(2)} y= {acc.y?.toFixed(2)} z= {acc.z?.toFixed(2)}</Text>
      <Text style={styles.label}>Steps: {steps}</Text>
      <Text style={styles.label}>Gyro:  x= {gyro.x?.toFixed(2)} y= {gyro.y?.toFixed(2)}</Text>
      <Text style={styles.label}>GPS:   {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}</Text>
      <Text style={styles.label}>Pressure: {pressure?.toFixed(2)} hPa</Text>
      <Text style={styles.label}>Battery: {battery ?? 'N/A'}%</Text>
      <Text style={styles.label}>Signal: {signal ?? 'N/A'}</Text>

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
      <GyroscopeReader onData={setGyro}/>  
      <BarometerReader onData={(pressure) => setPressure(pressure)} />
      <SignalReader onData={setSignal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.mainBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  text: { 
    color: colors.secondaryTextColor,
    fontSize: 18,
    margin: 10
  },
  title: { 
    fontSize: 24,
    color: colors.secondaryTextColor,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: { 
    fontSize: 16,
    color: colors.secondaryTextColor,
    marginBottom: 10,
    paddingTop: 10
  },
});
