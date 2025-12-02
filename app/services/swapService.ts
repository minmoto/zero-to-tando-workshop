/**
 * Swap Service
 * Handles fetching swap data from the API
 */

import { SwapResponse, StoredSwap, StoredSwapReference } from '../types';

/**
 * Fetch all swaps for the current agent from the API
 * Optionally filter by beneficiaryId
 */
export async function fetchAllAgentSwaps(beneficiaryId?: string): Promise<SwapResponse[]> {
  try {
    const url = new URL('/api/swaps/agent', window.location.origin);
    if (beneficiaryId) {
      url.searchParams.set('beneficiaryId', beneficiaryId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Failed to fetch agent swaps:', response.statusText);
      return [];
    }

    const data = await response.json();

    // Handle different response formats
    // The API returns an object with 'data' property containing the array
    if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.swaps)) {
      return data.swaps;
    } else if (data && typeof data === 'object') {
      // Log the actual structure to help debug
      console.warn('Unexpected API response structure:', data);
      return [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching agent swaps:', error);
    return [];
  }
}

/**
 * Fetch a single swap by ID from cached agent swaps
 */
export async function fetchSwapById(swapId: string): Promise<SwapResponse | null> {
  try {
    const allSwaps = await fetchAllAgentSwaps();
    return allSwaps.find(swap => swap.id === swapId) || null;
  } catch (error) {
    console.error(`Error fetching swap ${swapId}:`, error);
    return null;
  }
}

/**
 * Fetch swaps from API for a specific beneficiary
 * Uses the agent swaps endpoint and filters by beneficiaryId
 * Returns StoredSwap objects with beneficiaryId and savedAt preserved from references
 */
export async function fetchSwapsFromReferences(
  references: StoredSwapReference[]
): Promise<StoredSwap[]> {
  try {
    if (references.length === 0) {
      return [];
    }

    // Get the beneficiaryId from the first reference (all references should have the same beneficiaryId)
    const beneficiaryId = references[0].beneficiaryId;

    // Fetch agent swaps filtered by beneficiaryId
    const allSwaps = await fetchAllAgentSwaps(beneficiaryId);

    // Create a map of swapId to reference for quick lookup
    const referenceMap = new Map(
      references.map(ref => [ref.swapId, ref])
    );

    // Match swaps with their references and add metadata
    const storedSwaps: StoredSwap[] = allSwaps
      .filter(swap => referenceMap.has(swap.id))
      .map(swap => {
        const ref = referenceMap.get(swap.id)!;
        return {
          ...swap,
          beneficiaryId: ref.beneficiaryId,
          savedAt: ref.savedAt,
        };
      });

    return storedSwaps;
  } catch (error) {
    console.error('Error fetching swaps from references:', error);
    return [];
  }
}

/**
 * Fetch a single swap with its metadata
 */
export async function fetchStoredSwap(
  reference: StoredSwapReference
): Promise<StoredSwap | null> {
  const swap = await fetchSwapById(reference.swapId);

  if (!swap) return null;

  return {
    ...swap,
    beneficiaryId: reference.beneficiaryId,
    savedAt: reference.savedAt,
  };
}
