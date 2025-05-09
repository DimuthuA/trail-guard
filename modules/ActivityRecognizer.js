import { useRef, useState } from 'react';

export function useActivityRecognizer() {
  const [activity, setActivity] = useState('unknown');
  const magnitudes = useRef([]);

  const updateActivity = ({ x, y, z }) => {
    const mag = Math.sqrt(x * x + y * y + z * z);
    magnitudes.current.push(mag);
    if (magnitudes.current.length > 20) magnitudes.current.shift();

    const avg = magnitudes.current.reduce((a, b) => a + b, 0) / magnitudes.current.length;
    const variance = magnitudes.current.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / magnitudes.current.length;

    if (variance < 0.01) {
      setActivity('Inactive');
    } else if (variance > 0.5) {
      setActivity('Running');
    } else {
      setActivity('Moving');
    }
  };

  return { activity, updateActivity };
}
