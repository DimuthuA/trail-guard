// modules/stepCounter.js

let lastMagnitude = 0;
let lastStepTime = 0;

const THRESHOLD = 1.2;
const MIN_INTERVAL = 400; // ms between steps
const VALIDATION_STEPS = 6;
const VALIDATION_WINDOW_MS = 4000;
const INACTIVITY_TIMEOUT = 10000; // 10 seconds of no steps = not walking

let hiddenSteps = 0;
let isWalking = false;
let firstStepTime = null;

/**
 * Main step detection logic
 * @param {Object} accData - Accelerometer data
 * @param {Function} onStepConfirmed - Callback to increment total step count
 * @returns {boolean} isWalking
 */
export function detectStep(accData, onStepConfirmed) {
  const now = Date.now();

  const magnitude = Math.sqrt(
    accData.x ** 2 + accData.y ** 2 + accData.z ** 2
  );
  const diff = Math.abs(magnitude - lastMagnitude);
  lastMagnitude = magnitude;

  // If user was walking but now inactive, reset state
  if (isWalking && now - lastStepTime > INACTIVITY_TIMEOUT) {
    isWalking = false;
    hiddenSteps = 0;
    firstStepTime = null;
    // Optional: you could call onStopWalking() here
  }

  if (diff > THRESHOLD && now - lastStepTime > MIN_INTERVAL) {
    lastStepTime = now;

    if (!isWalking) {
      if (!firstStepTime) {
        firstStepTime = now;
      }

      hiddenSteps++;

      if (
        hiddenSteps >= VALIDATION_STEPS &&
        now - firstStepTime <= VALIDATION_WINDOW_MS
      ) {
        isWalking = true;
        for (let i = 0; i < hiddenSteps; i++) {
          onStepConfirmed();
        }
        hiddenSteps = 0;
      }

      // Too slow = reset validation
      if (now - firstStepTime > VALIDATION_WINDOW_MS) {
        hiddenSteps = 0;
        firstStepTime = null;
      }
    } else {
      // Already validated — count step
      onStepConfirmed();
    }
  }

  return isWalking;
}

export function resetStepDetection() {
  hiddenSteps = 0;
  isWalking = false;
  firstStepTime = null;
}
