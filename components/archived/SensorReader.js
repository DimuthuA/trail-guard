// SensorReader.js
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { detectStep } from '../../modules/stepCounter';

export default function SensorReader() {
  const [steps, setSteps] = useState(0);
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 10 Hz

    const subscription = accelerometer
      .pipe(
        map(({ x, y, z }) => {
          setAccData({ x, y, z });
          if (detectStep({ x, y, z })) {
            setSteps(prev => prev + 1);
          }
        })
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
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
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, margin: 10 },
});
