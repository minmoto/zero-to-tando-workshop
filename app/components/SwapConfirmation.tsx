'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { SwapResponse, PaymentRail } from '../types';

interface SwapConfirmationProps {
  swap: SwapResponse;
}

export function SwapConfirmation({ swap }: SwapConfirmationProps) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const formatNumber = (num: string): string => {
    if (!num) return '0';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const copyReference = async () => {
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

  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Success Animation */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center animate-scale-in">
            <svg
              className="w-10 h-10 text-green-500 dark:text-green-400 animate-check-draw"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Success checkmark"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Swap Created Successfully
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your swap has been created and is ready for payment
        </p>
      </div>

      {/* Swap Reference */}
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

      {/* Amount Summary */}
      <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
        <div className="space-y-4">
          <div>
            <div className="text-sm text-blue-100 mb-1">You will send</div>
            <div className="text-3xl font-bold">
              {formatNumber(swap.bitcoinAmount)} sats
            </div>
          </div>
          <div className="border-t border-blue-400 pt-4">
            <div className="text-sm text-blue-100 mb-1">You will receive</div>
            <div className="text-3xl font-bold">
              KES {formatNumber(swap.fiatAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          What Happens Next
        </h3>
        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
              1
            </span>
            <span>Pay the Lightning invoice to lock in your exchange rate</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
              2
            </span>
            <span>An agent will be matched to fulfill your swap</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
              3
            </span>
            <span>Your Bitcoin will be held in escrow until payment is complete</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
              4
            </span>
            <span>Receive KES {formatNumber(swap.fiatAmount)} via {getPaymentMethodLabel(swap.paymentChannel)}</span>
          </li>
        </ol>
      </div>

      {/* Expandable Details */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={showDetails}
          aria-label="Toggle swap details"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Swap Details
          </span>
          <svg
            className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
              showDetails ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showDetails && (
          <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Swap ID</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {swap.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
              <span className="text-gray-900 dark:text-white">
                1 BTC = KES {formatNumber(swap.exchangeRate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
              <span className="text-gray-900 dark:text-white">
                {getPaymentMethodLabel(swap.paymentChannel)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="text-gray-900 dark:text-white capitalize">
                {swap.state.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Created</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(swap.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleViewHistory}
          className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          View All Swaps
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dashoffset: 50;
            stroke-dasharray: 50;
          }
          100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 50;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-check-draw {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: check-draw 0.5s 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
