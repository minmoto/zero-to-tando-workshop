/**
 * Swap Storage Manager
 * Handles persistence of minimal swap data in localStorage
 *
 * Features:
 * - Store only swapId and beneficiaryId (minimal storage)
 * - Retrieve swap references by beneficiary ID
 * - Automatic cache expiration (7 days)
 * - Type-safe storage operations
 */

import { SwapResponse, StoredSwapReference } from '../types';

const SWAPS_STORAGE_KEY = 'minmo_swaps';
const CACHE_DURATION_DAYS = 7;

/**
 * Save a swap reference to localStorage (only stores swapId and beneficiaryId)
 */
export function saveSwap(swap: SwapResponse, beneficiaryId: string): void {
  if (typeof window === 'undefined') {
    console.warn('saveSwap can only be called in browser environment');
    return;
  }

  try {
    const swapReference: StoredSwapReference = {
      swapId: swap.id,
      beneficiaryId,
      savedAt: new Date().toISOString()
    };

    const existingRefs = getSwapReferences();

    // Check if swap already exists (by ID) and update it
    const swapIndex = existingRefs.findIndex(s => s.swapId === swap.id);

    if (swapIndex >= 0) {
      existingRefs[swapIndex] = swapReference;
    } else {
      existingRefs.push(swapReference);
    }

    localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(existingRefs));
  } catch (error) {
    console.error('Failed to save swap reference:', error);
  }
}

/**
 * Get all swap references from localStorage
 * Automatically removes expired references (older than 7 days)
 */
export function getSwapReferences(beneficiaryId?: string): StoredSwapReference[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedData = localStorage.getItem(SWAPS_STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const allRefs: StoredSwapReference[] = JSON.parse(storedData);
    const now = new Date();
    const expirationDate = new Date(now.getTime() - CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000);

    // Filter out expired references
    const validRefs = allRefs.filter(ref => {
      const savedDate = new Date(ref.savedAt);
      return savedDate > expirationDate;
    });

    // Update storage if we removed any expired references
    if (validRefs.length !== allRefs.length) {
      localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(validRefs));
    }

    // Filter by beneficiary ID if provided
    if (beneficiaryId) {
      return validRefs.filter(ref => ref.beneficiaryId === beneficiaryId);
    }

    return validRefs;
  } catch (error) {
    console.error('Failed to get swap references:', error);
    return [];
  }
}

/**
 * Get a single swap reference by its ID
 */
export function getSwapReferenceById(id: string): StoredSwapReference | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const refs = getSwapReferences();
    return refs.find(ref => ref.swapId === id) || null;
  } catch (error) {
    console.error('Failed to get swap reference by ID:', error);
    return null;
  }
}

/**
 * Clear all stored swap references
 */
export function clearSwaps(): void {
  if (typeof window === 'undefined') {
    console.warn('clearSwaps can only be called in browser environment');
    return;
  }

  try {
    localStorage.removeItem(SWAPS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear swap references:', error);
  }
}

/**
 * Get swap references count for a beneficiary
 */
export function getSwapsCount(beneficiaryId?: string): number {
  return getSwapReferences(beneficiaryId).length;
}

/**
 * Delete a specific swap reference by ID
 */
export function deleteSwap(id: string): boolean {
  if (typeof window === 'undefined') {
    console.warn('deleteSwap can only be called in browser environment');
    return false;
  }

  try {
    const refs = getSwapReferences();
    const filteredRefs = refs.filter(ref => ref.swapId !== id);

    if (filteredRefs.length === refs.length) {
      return false; // Swap reference not found
    }

    localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(filteredRefs));
    return true;
  } catch (error) {
    console.error('Failed to delete swap reference:', error);
    return false;
  }
}
