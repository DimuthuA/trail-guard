
let lastMagnitude = 0;
let lastStepTime = 0;

export function detectStep(accData) {
  const now = Date.now();

  // Combine x, y, z into a magnitude (basic acceleration strength)
  const magnitude = Math.sqrt(
    accData.x * accData.x +
    accData.y * accData.y +
    accData.z * accData.z
  );

  const diff = Math.abs(magnitude - lastMagnitude);
  lastMagnitude = magnitude;

  // Threshold and debounce logic
  const THRESHOLD = 1.2;
  const MIN_INTERVAL = 400; // ms between steps

  if (diff > THRESHOLD && (now - lastStepTime) > MIN_INTERVAL) {
    lastStepTime = now;
    return true;
  }

  return false;
}
