/**
 * Swap Storage Manager
 * Handles persistence of swap data in localStorage
 *
 * Features:
 * - Store swaps with beneficiary association
 * - Retrieve swaps by beneficiary ID
 * - Automatic cache expiration (7 days)
 * - Type-safe storage operations
 */

import { SwapResponse, StoredSwap } from '../types';

const SWAPS_STORAGE_KEY = 'minmo_swaps';
const CACHE_DURATION_DAYS = 7;

/**
 * Save a swap to localStorage
 */
export function saveSwap(swap: SwapResponse, beneficiaryId: string): void {
  if (typeof window === 'undefined') {
    console.warn('saveSwap can only be called in browser environment');
    return;
  }

  try {
    const storedSwap: StoredSwap = {
      ...swap,
      beneficiaryId,
      savedAt: new Date().toISOString()
    };

    const existingSwaps = getSwaps();

    // Check if swap already exists (by ID) and update it
    const swapIndex = existingSwaps.findIndex(s => s.id === swap.id);

    if (swapIndex >= 0) {
      existingSwaps[swapIndex] = storedSwap;
    } else {
      existingSwaps.push(storedSwap);
    }

    localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(existingSwaps));
  } catch (error) {
    console.error('Failed to save swap:', error);
  }
}

/**
 * Get all swaps, optionally filtered by beneficiary ID
 * Automatically removes expired swaps (older than 7 days)
 */
export function getSwaps(beneficiaryId?: string): StoredSwap[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedData = localStorage.getItem(SWAPS_STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    const allSwaps: StoredSwap[] = JSON.parse(storedData);
    const now = new Date();
    const expirationDate = new Date(now.getTime() - CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000);

    // Filter out expired swaps
    const validSwaps = allSwaps.filter(swap => {
      const savedDate = new Date(swap.savedAt);
      return savedDate > expirationDate;
    });

    // Update storage if we removed any expired swaps
    if (validSwaps.length !== allSwaps.length) {
      localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(validSwaps));
    }

    // Filter by beneficiary ID if provided
    if (beneficiaryId) {
      return validSwaps.filter(swap => swap.beneficiaryId === beneficiaryId);
    }

    return validSwaps;
  } catch (error) {
    console.error('Failed to get swaps:', error);
    return [];
  }
}

/**
 * Get a single swap by its ID
 */
export function getSwapById(id: string): StoredSwap | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const swaps = getSwaps();
    return swaps.find(swap => swap.id === id) || null;
  } catch (error) {
    console.error('Failed to get swap by ID:', error);
    return null;
  }
}

/**
 * Clear all stored swaps
 */
export function clearSwaps(): void {
  if (typeof window === 'undefined') {
    console.warn('clearSwaps can only be called in browser environment');
    return;
  }

  try {
    localStorage.removeItem(SWAPS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear swaps:', error);
  }
}

/**
 * Get swaps count for a beneficiary
 */
export function getSwapsCount(beneficiaryId?: string): number {
  return getSwaps(beneficiaryId).length;
}

/**
 * Delete a specific swap by ID
 */
export function deleteSwap(id: string): boolean {
  if (typeof window === 'undefined') {
    console.warn('deleteSwap can only be called in browser environment');
    return false;
  }

  try {
    const swaps = getSwaps();
    const filteredSwaps = swaps.filter(swap => swap.id !== id);

    if (filteredSwaps.length === swaps.length) {
      return false; // Swap not found
    }

    localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(filteredSwaps));
    return true;
  } catch (error) {
    console.error('Failed to delete swap:', error);
    return false;
  }
}

/**
 * Update a swap's state
 */
export function updateSwapState(id: string, updatedSwap: SwapResponse): boolean {
  if (typeof window === 'undefined') {
    console.warn('updateSwapState can only be called in browser environment');
    return false;
  }

  try {
    const swaps = getSwaps();
    const swapIndex = swaps.findIndex(swap => swap.id === id);

    if (swapIndex === -1) {
      return false;
    }

    // Preserve beneficiaryId and savedAt
    swaps[swapIndex] = {
      ...updatedSwap,
      beneficiaryId: swaps[swapIndex].beneficiaryId,
      savedAt: swaps[swapIndex].savedAt
    };

    localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(swaps));
    return true;
  } catch (error) {
    console.error('Failed to update swap state:', error);
    return false;
  }
}
