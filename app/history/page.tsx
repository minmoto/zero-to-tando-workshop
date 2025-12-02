'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SwapFilterOption, SwapSortOption, StoredSwap, SwapState } from '../types';
import { SwapCard } from '../components/SwapCard';
import { SwapFilters } from '../components/SwapFilters';
import { getSwapReferences } from '../lib/swapStorage';
import { getBeneficiaryId } from '../lib/beneficiary';
import { fetchSwapsFromReferences } from '../services/swapService';

const SWAPS_PER_PAGE = 10;

export default function HistoryPage() {
  const router = useRouter();
  const [beneficiaryId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getBeneficiaryId();
    }
    return '';
  });
  const [swaps, setSwaps] = useState<StoredSwap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<SwapFilterOption>('all');
  const [sort, setSort] = useState<SwapSortOption>('newest');
  const [displayCount, setDisplayCount] = useState(SWAPS_PER_PAGE);

  useEffect(() => {
    async function loadSwaps() {
      if (typeof window === 'undefined' || !beneficiaryId) {
        setIsLoading(false);
        return;
      }

      try {
        const references = getSwapReferences(beneficiaryId);
        const fetchedSwaps = await fetchSwapsFromReferences(references);
        setSwaps(fetchedSwaps);
      } catch (error) {
        console.error('Failed to load swaps:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSwaps();
  }, [beneficiaryId]);

  const filterSwaps = (swaps: StoredSwap[]): StoredSwap[] => {
    switch (filter) {
      case 'completed':
        return swaps.filter(swap => swap.state === SwapState.COMPLETED);
      case 'pending':
        return swaps.filter(
          swap =>
            swap.state !== SwapState.COMPLETED &&
            swap.state !== SwapState.CANCELLED &&
            swap.state !== SwapState.DISPUTED
        );
      default:
        return swaps;
    }
  };

  const sortSwaps = (swaps: StoredSwap[]): StoredSwap[] => {
    const sorted = [...swaps];

    switch (sort) {
      case 'oldest':
        return sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'amount_high':
        return sorted.sort(
          (a, b) => parseFloat(b.fiatAmount) - parseFloat(a.fiatAmount)
        );
      case 'amount_low':
        return sorted.sort(
          (a, b) => parseFloat(a.fiatAmount) - parseFloat(b.fiatAmount)
        );
      case 'newest':
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const filteredAndSortedSwaps = sortSwaps(filterSwaps(swaps));
  const displayedSwaps = filteredAndSortedSwaps.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSortedSwaps.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + SWAPS_PER_PAGE);
  };

  const handleNewSwap = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Swap History
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-14">
            View and track all your Bitcoin offramp swaps
          </p>
        </div>

        {/* Filters */}
        {swaps.length > 0 && (
          <div className="mb-6">
            <SwapFilters
              filter={filter}
              sort={sort}
              totalCount={filteredAndSortedSwaps.length}
              onFilterChange={setFilter}
              onSortChange={setSort}
            />
          </div>
        )}

        {/* Swap List */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-10 w-10 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Loading swap history...</p>
          </div>
        ) : swaps.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No swaps yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven&apos;t created any swaps yet. Start your first Bitcoin offramp to see it here.
            </p>
            <button
              onClick={handleNewSwap}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Create Your First Swap
            </button>
          </div>
        ) : filteredAndSortedSwaps.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No swaps found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No swaps match your current filter. Try adjusting your filters.
            </p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View All Swaps
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedSwaps.map((swap) => (
              <SwapCard key={swap.id} swap={swap} />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Load More ({filteredAndSortedSwaps.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* New Swap Button (when swaps exist) */}
        {swaps.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNewSwap}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Create New Swap
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Swaps are stored locally and expire after 7 days</p>
        </div>
      </div>
    </div>
  );
}
