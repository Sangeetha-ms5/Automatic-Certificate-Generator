/**
 * Credential ID Generator
 * Format: CMX-YYYY-001
 */

const COUNTER_KEY_PREFIX = 'cmx_credential_counter_';
const ID_PREFIX = 'CMX';

/**
 * Get current year
 */
function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

/**
 * Get storage key based on year
 */
function getYearlyCounterKey(): string {
  return `${COUNTER_KEY_PREFIX}${getCurrentYear()}`;
}

/**
 * Generate Credential ID
 */
export function generateCredentialId(): string {

  const year = getCurrentYear();
  const counterKey = getYearlyCounterKey();

  // Get current counter for this year
  const currentCounter = parseInt(
    localStorage.getItem(counterKey) || '0',
    10
  );

  // Increment counter
  const nextCounter = currentCounter + 1;

  // Save updated counter
  localStorage.setItem(counterKey, nextCounter.toString());

  // Format number (001, 002, 003...)
  const paddedNumber = nextCounter.toString().padStart(3, '0');

  return `${ID_PREFIX}-${year}-${paddedNumber}`;
}

/**
 * Get current counter (without increment)
 */
export function getCurrentCounter(): number {
  const counterKey = getYearlyCounterKey();
  return parseInt(localStorage.getItem(counterKey) || '0', 10);
}

/**
 * Reset counter for current year
 */
export function resetCounter(): void {
  const counterKey = getYearlyCounterKey();
  localStorage.setItem(counterKey, '0');
}

/**
 * Set counter manually (Admin)
 */
export function setCounter(value: number): void {
  const counterKey = getYearlyCounterKey();
  localStorage.setItem(counterKey, Math.max(0, value).toString());
}