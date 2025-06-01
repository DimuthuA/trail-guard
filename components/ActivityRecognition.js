import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { uploadHikerData } from '../firebase/uploadService';
import { useActivityRecognizer } from '../modules/ActivityRecognizer';
import AccelerometerReader from './sensors/AccelerometerReader';
import BatteryReader from './sensors/BatteryReader';
import LocationReader from './sensors/LocationReader';

export default function ActivityScreen() {
  const [acc, setAcc] = useState({});
  const { activity, updateActivity } = useActivityRecognizer();
  const [loc, setLoc] = useState({});
  const [battery, setBattery] = useState(null);

  

  useEffect(() => {
    const coords = {
    latitude: loc?.latitude,
    longitude: loc?.longitude,
  };
  const interval = setInterval(() => {
    uploadHikerData("hiker123", {
      activity: activity,
      battery: battery,
      location: `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
    });
  }, 600000); // Every 10 min

  return () => clearInterval(interval);
}, [activity, battery, loc]);


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
          updateActivity(data);
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
