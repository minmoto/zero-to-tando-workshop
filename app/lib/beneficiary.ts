/**
 * Beneficiary ID Manager
 * Handles generation and persistence of beneficiary IDs for swap tracking
 *
 * A beneficiary ID uniquely identifies a user across swap sessions.
 * It's stored in localStorage and reused for all swaps from the same browser/device.
 */

const BENEFICIARY_ID_KEY = 'beneficiary_id';

/**
 * Generate a new UUID v4
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get the current beneficiary ID from localStorage
 * If none exists, generate and store a new one
 */
export function getBeneficiaryId(): string {
  if (typeof window === 'undefined') {
    throw new Error('getBeneficiaryId can only be called in browser environment');
  }

  try {
    let beneficiaryId = localStorage.getItem(BENEFICIARY_ID_KEY);

    if (!beneficiaryId) {
      beneficiaryId = generateUUID();
      localStorage.setItem(BENEFICIARY_ID_KEY, beneficiaryId);
    }

    return beneficiaryId;
  } catch (error) {
    console.error('Failed to get/set beneficiaryId:', error);
    // Return a temporary ID if localStorage is not available
    return generateUUID();
  }
}

/**
 * Set a specific beneficiary ID (useful for testing or migration)
 */
export function setBeneficiaryId(id: string): void {
  if (typeof window === 'undefined') {
    throw new Error('setBeneficiaryId can only be called in browser environment');
  }

  try {
    localStorage.setItem(BENEFICIARY_ID_KEY, id);
  } catch (error) {
    console.error('Failed to set beneficiaryId:', error);
  }
}

/**
 * Clear the beneficiary ID (useful for testing)
 */
export function clearBeneficiaryId(): void {
  if (typeof window === 'undefined') {
    throw new Error('clearBeneficiaryId can only be called in browser environment');
  }

  try {
    localStorage.removeItem(BENEFICIARY_ID_KEY);
  } catch (error) {
    console.error('Failed to clear beneficiaryId:', error);
  }
}

/**
 * Check if a beneficiary ID exists in localStorage
 */
export function hasBeneficiaryId(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return localStorage.getItem(BENEFICIARY_ID_KEY) !== null;
  } catch (error) {
    console.error('Failed to check beneficiaryId:', error);
    return false;
  }
}
