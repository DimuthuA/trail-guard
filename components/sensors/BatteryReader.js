import React, { useEffect } from 'react';
import * as Battery from 'expo-battery';

export default function BatteryReader({ onData }) {
  useEffect(() => {
    const read = async () => {
      const level = await Battery.getBatteryLevelAsync();
      if (onData) onData(Math.round(level * 100));
    };
    read();

    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      if (onData) onData(Math.round(batteryLevel * 100));
    });

    return () => subscription.remove();
  }, []);

  return null;
}
