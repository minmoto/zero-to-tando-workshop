'use client';

import { useEffect, useState } from 'react';
import { SwapResponse, SwapState } from '../types';

interface SwapTrackerProps {
  swap: SwapResponse;
  onNewSwap: () => void;
}

export function SwapTracker({ swap, onNewSwap }: SwapTrackerProps) {
  const [currentSwap, setCurrentSwap] = useState<SwapResponse>(swap);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!isPolling || currentSwap.state === SwapState.COMPLETED) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/swap/${swap.id}`);
        const data = await response.json();
        setCurrentSwap(data);
      } catch (error) {
        console.error('Failed to fetch swap status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [swap.id, isPolling, currentSwap.state]);

  const formatNumber = (num: string): string => {
    if (!num) return '0';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Swap Summary */}
      <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-100">You sent</span>
            <span className="text-xl font-bold">
              {formatNumber(currentSwap.bitcoinAmount)} sats
            </span>
          </div>
          <div className="border-t border-blue-400 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-100">You receive</span>
              <span className="text-xl font-bold">
                KES {formatNumber(currentSwap.fiatAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Details */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Swap Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Reference</span>
            <span className="text-gray-900 dark:text-white font-mono">
              {currentSwap.reference}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
            <span className="text-gray-900 dark:text-white">
              1 BTC = KES {formatNumber(currentSwap.exchangeRate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
            <span className="text-gray-900 dark:text-white capitalize">
              {currentSwap.paymentChannel.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Created</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(currentSwap.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Completion Actions */}
      {currentSwap.state === SwapState.COMPLETED && (
        <div className="space-y-3 pt-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex gap-3">
              <div className="text-green-600 dark:text-green-500 text-2xl">
                🎉
              </div>
              <div>
                <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                  Swap Completed!
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Your KES {formatNumber(currentSwap.fiatAmount)} should arrive in your account shortly.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onNewSwap}
            className="w-full px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Create Another Swap
          </button>
        </div>
      )}
    </div>
  );
}
