export function getSLTTimestamp() {
  return new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Colombo',
    hour12: true,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
