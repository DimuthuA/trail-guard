import { useEffect } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default function SignalReader({ onData }) {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const read = async () => {
      const strength = await DeviceInfo.getCarrier();
      const simInfo = await DeviceInfo.getPhoneNumber();
      if (onData) onData(strength);
    };

    read();
    const interval = setInterval(read, 10000); // poll every 10 sec

    return () => clearInterval(interval);
  }, []);

  return null;
}
