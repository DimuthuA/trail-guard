import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { detectStep } from '../modules/stepCounter';

export function SensorReader() {
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); // 10 samples/sec

    const subscription = Accelerometer.addListener(data => {
      setAccData(data);
      if (detectStep(data)) {
        setSteps(prev => prev + 1);
      }
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Steps: {steps}</Text>
      <Text style={styles.text}>x: {accData.x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {accData.y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {accData.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#111', flex: 1 },
  text: { color: '#fff', fontSize: 18, marginBottom: 10 },
});
