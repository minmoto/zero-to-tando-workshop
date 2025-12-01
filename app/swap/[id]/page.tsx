'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { StoredSwap, SwapState, PaymentRail } from '../../types';
import { getSwapById } from '../../lib/swapStorage';
import { SwapTracker } from '../../components/SwapTracker';

export default function SwapDetailPage() {
  const router = useRouter();
  const params = useParams();
  const swapId = params.id as string;

  const [swap, setSwap] = useState<StoredSwap | null>(() => {
    return swapId ? getSwapById(swapId) : null;
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (swapId && !swap) {
      toast.error('Swap not found');
    }
  }, [swapId, swap]);


  const getPaymentMethodLabel = (channel: string): string => {
    switch (channel) {
      case PaymentRail.MOBILE_MONEY:
        return 'M-Pesa';
      case PaymentRail.BANK_TRANSFER:
        return 'Bank Transfer';
      default:
        return channel.replace(/_/g, ' ');
    }
  };

  const copyReference = async () => {
    if (!swap) return;

    try {
      await navigator.clipboard.writeText(swap.reference);
      setCopied(true);
      toast.success('Reference copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy reference');
    }
  };

  const handleBack = () => {
    router.push('/history');
  };

  const handleNewSwap = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
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
          <p className="text-gray-600 dark:text-gray-400">Loading swap details...</p>
        </div>
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Swap Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The swap you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back to History
              </button>
              <button
                onClick={handleNewSwap}
                className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              >
                Create New Swap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = swap.state === SwapState.COMPLETED;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Go back to history"
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Swap Details
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(swap.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Reference Card */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                  Swap Reference
                </div>
                <div className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                  {swap.reference}
                </div>
              </div>
              <button
                onClick={copyReference}
                className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                aria-label="Copy swap reference"
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Swap Tracker */}
          <SwapTracker swap={swap} onNewSwap={handleNewSwap} />

          {/* Payment Details Section */}
          {swap.userPaymentDetails && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Payment Details
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {getPaymentMethodLabel(swap.paymentChannel)}
                  </span>
                </div>
                {Object.entries(swap.userPaymentDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Payment Details (if available) */}
          {swap.agentPaymentDetails && Object.keys(swap.agentPaymentDetails).length > 0 && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Agent Payment Information
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3 text-sm">
                {Object.entries(swap.agentPaymentDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-blue-900 dark:text-blue-300 font-medium">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Swap ID</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">
                  {swap.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-white capitalize">
                  {swap.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Saved</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(swap.savedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Back to History
          </button>
          {isCompleted && (
            <button
              onClick={handleNewSwap}
              className="flex-1 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Create New Swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
