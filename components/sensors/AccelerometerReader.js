import { useEffect } from 'react';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

export default function AccelerometerReader({ onData }) {
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    const sub = accelerometer.subscribe(data => onData(data));
    return () => sub.unsubscribe();
  }, []);
  return null;
}
