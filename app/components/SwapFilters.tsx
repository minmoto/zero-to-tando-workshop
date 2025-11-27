'use client';

import { SwapFilterOption, SwapSortOption } from '../types';

interface SwapFiltersProps {
  filter: SwapFilterOption;
  sort: SwapSortOption;
  totalCount: number;
  onFilterChange: (filter: SwapFilterOption) => void;
  onSortChange: (sort: SwapSortOption) => void;
}

export function SwapFilters({
  filter,
  sort,
  totalCount,
  onFilterChange,
  onSortChange
}: SwapFiltersProps) {
  const filterOptions: { value: SwapFilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  const sortOptions: { value: SwapSortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount_high', label: 'Amount: High to Low' },
    { value: 'amount_low', label: 'Amount: Low to High' }
  ];

  return (
    <div className="space-y-4">
      {/* Swap Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Swaps
          {totalCount > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({totalCount} {totalCount === 1 ? 'swap' : 'swaps'})
            </span>
          )}
        </h2>
      </div>

      {/* Filters and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter Tabs */}
        <div className="flex-1">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800/50">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${
                    filter === option.value
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
                aria-label={`Filter by ${option.label.toLowerCase()}`}
                aria-pressed={filter === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">
            Sort swaps by
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SwapSortOption)}
              className="appearance-none pl-4 pr-10 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              aria-label="Sort swaps"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
