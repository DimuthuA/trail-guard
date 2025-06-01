import { useRef, useState } from 'react';

// Reusable detection logic
export function detectActivity({ x, y, z }, magnitudesRef) {
  const mag = Math.sqrt(x * x + y * y + z * z);
  magnitudesRef.current.push(mag);
  if (magnitudesRef.current.length > 20) magnitudesRef.current.shift();

  const avg = magnitudesRef.current.reduce((a, b) => a + b, 0) / magnitudesRef.current.length;
  const variance = magnitudesRef.current.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / magnitudesRef.current.length;

  if (variance < 0.01) return 'Inactive';
  if (variance > 0.5) return 'Running';
  return 'Moving';
}

// Hook for global state
export function useActivityRecognizer() {
  const [activity, setActivity] = useState('unknown');
  const magnitudes = useRef([]);

  const updateActivity = (data) => {
    const result = detectActivity(data, magnitudes);
    setActivity(result);
  };

  return { activity, updateActivity };
}
