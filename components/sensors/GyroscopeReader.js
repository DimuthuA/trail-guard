import React, { useEffect } from 'react';
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

export default function GyroscopeReader({ onData }) {
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.gyroscope, 100);
    const sub = gyroscope.subscribe(data => onData(data));
    return () => sub.unsubscribe();
  }, []);
  return null;
}
