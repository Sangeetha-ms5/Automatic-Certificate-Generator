/**
 * Credential ID Generator
 * Generates auto-incrementing credential IDs in format: CMX-0001, CMX-0002, etc.
 */

const COUNTER_KEY = 'cmx_credential_counter';
const ID_PREFIX = 'CMX-';

/**
 * Get the next credential ID and increment the counter
 */
export function generateCredentialId(): string {
  // Get current counter from localStorage
  const currentCounter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);

  // Increment counter
  const nextCounter = currentCounter + 1;

  // Save updated counter
  localStorage.setItem(COUNTER_KEY, nextCounter.toString());

  // Format ID with leading zeros (e.g., CMX-0001)
  const paddedNumber = nextCounter.toString().padStart(4, '0');

  return `${ID_PREFIX}${paddedNumber}`;
}

/**
 * Get current counter value without incrementing
 */
export function getCurrentCounter(): number {
  return parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
}

/**
 * Reset counter (admin function)
 */
export function resetCounter(): void {
  localStorage.setItem(COUNTER_KEY, '0');
}

/**
 * Set counter to specific value (admin function)
 */
export function setCounter(value: number): void {
  localStorage.setItem(COUNTER_KEY, Math.max(0, value).toString());
}
