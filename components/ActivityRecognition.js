import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useActivityRecognizer } from '../modules/ActivityRecognizer';
import AccelerometerReader from './sensors/AccelerometerReader';

export default function ActivityScreen() {
  const [acc, setAcc] = useState({});
  const { activity, updateActivity } = useActivityRecognizer();

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, margin: 10 },
  title: { fontSize: 24, color: '#000', marginBottom: 20 },
  label: { fontSize: 16, color: '#ccc', marginBottom: 10, paddingTop: 10 },
});
