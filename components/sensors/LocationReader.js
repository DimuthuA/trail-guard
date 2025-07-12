import { useEffect } from 'react';
import * as Location from 'expo-location';

export default function LocationReader({ onLocation }) {
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 15000 },
          loc => onLocation(loc.coords)
        );
        return () => sub.remove();
      }
    })();
  }, []);
  return null;
}
