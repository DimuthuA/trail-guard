/**
 * Wraps a promise with a timeout; rejects if timeout is reached first.
 * @param {Promise} promise - The promise to wrap.
 * @param {number} ms - Timeout in milliseconds.
 * @returns {Promise}
 */
export function withTimeout(promise, ms) {
  let timeoutId;

  return Promise.race([
    // Incase promise resolves or rejects, clear the timeout
    promise.finally(() => clearTimeout(timeoutId)), 
    
    // Create a timeout promise that rejects after `ms` milliseconds
    new Promise((_, reject) =>
      timeoutId = setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

