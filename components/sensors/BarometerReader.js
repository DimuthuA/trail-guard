import { Barometer } from 'expo-sensors';
import { useEffect } from 'react';

export default function BarometerReader({ onData }) {
  useEffect(() => {
    const subscription = Barometer.addListener(({ pressure }) => {
    //   console.log('Pressure:', pressure);
      if (onData) onData(pressure);
    });

    return () => subscription.remove();
  }, []);

  return null;
}
