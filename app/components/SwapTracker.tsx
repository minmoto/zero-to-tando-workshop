'use client';

import { useEffect, useState } from 'react';
import { SwapResponse, SwapState } from '../types';

interface SwapTrackerProps {
  swap: SwapResponse;
  onNewSwap: () => void;
}

interface SwapStep {
  label: string;
  description: string;
  state: SwapState[];
  icon: string;
}

const SWAP_STEPS: SwapStep[] = [
  {
    label: 'Invoice Paid',
    description: 'Waiting for Lightning payment',
    state: [SwapState.CREATED, SwapState.ESCROW_PENDING],
    icon: '⚡'
  },
  {
    label: 'Agent Matched',
    description: 'Finding an agent to fulfill your swap',
    state: [SwapState.AGENT_MATCHED],
    icon: '🤝'
  },
  {
    label: 'Escrow Locked',
    description: 'Bitcoin secured in escrow',
    state: [SwapState.ESCROW_LOCKED],
    icon: '🔒'
  },
  {
    label: 'Payment Processing',
    description: 'Agent is sending your local currency',
    state: [
      SwapState.PAYMENT_INSTRUCTED,
      SwapState.PAYMENT_PENDING,
      SwapState.PAYMENT_SUBMITTED,
      SwapState.PAYMENT_CONFIRMED_USER,
      SwapState.PAYMENT_CONFIRMED_AGENT
    ],
    icon: '💸'
  },
  {
    label: 'Completed',
    description: 'Swap completed successfully',
    state: [SwapState.COMPLETED],
    icon: '✅'
  }
];

export function SwapTracker({ swap, onNewSwap }: SwapTrackerProps) {
  const [currentSwap, setCurrentSwap] = useState<SwapResponse>(swap);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!isPolling || currentSwap.state === SwapState.COMPLETED) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        // Mock API call - replace with actual swap status fetch
        // const response = await fetch(`/api/swap/${swap.id}`);
        // const data = await response.json();
        // setCurrentSwap(data);

        // For demo, we'll keep the current state
      } catch (error) {
        console.error('Failed to fetch swap status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [swap.id, isPolling, currentSwap.state]);

  const getCurrentStepIndex = (): number => {
    return SWAP_STEPS.findIndex((step) => step.state.includes(currentSwap.state));
  };

  const isStepCompleted = (stepIndex: number): boolean => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex > stepIndex;
  };

  const isStepActive = (stepIndex: number): boolean => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex === stepIndex;
  };

  const formatNumber = (num: string): string => {
    if (!num) return '0';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getStateMessage = (): { title: string; description: string } => {
    switch (currentSwap.state) {
      case SwapState.CREATED:
        return {
          title: 'Swap Created',
          description: 'Pay the Lightning invoice to continue'
        };
      case SwapState.ESCROW_PENDING:
        return {
          title: 'Awaiting Payment',
          description: 'Waiting for Lightning invoice payment'
        };
      case SwapState.AGENT_MATCHED:
        return {
          title: 'Agent Matched',
          description: 'An agent has been assigned to your swap'
        };
      case SwapState.ESCROW_LOCKED:
        return {
          title: 'Bitcoin Secured',
          description: 'Your bitcoin is safely locked in escrow'
        };
      case SwapState.PAYMENT_INSTRUCTED:
      case SwapState.PAYMENT_PENDING:
        return {
          title: 'Payment in Progress',
          description: 'Agent is sending your local currency'
        };
      case SwapState.PAYMENT_SUBMITTED:
        return {
          title: 'Payment Submitted',
          description: 'Agent has initiated the payment'
        };
      case SwapState.PAYMENT_CONFIRMED_USER:
      case SwapState.PAYMENT_CONFIRMED_AGENT:
        return {
          title: 'Almost Done',
          description: 'Waiting for final confirmation'
        };
      case SwapState.COMPLETED:
        return {
          title: 'Swap Completed',
          description: 'Your funds have been delivered successfully'
        };
      case SwapState.CANCELLED:
        return {
          title: 'Swap Cancelled',
          description: 'This swap was cancelled'
        };
      case SwapState.DISPUTED:
        return {
          title: 'Disputed',
          description: 'This swap is under review'
        };
      default:
        return {
          title: 'Processing',
          description: 'Your swap is being processed'
        };
    }
  };

  const stateMessage = getStateMessage();

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {stateMessage.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stateMessage.description}
        </p>
      </div>

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

      {/* Progress Steps */}
      <div className="space-y-4">
        {SWAP_STEPS.map((step, index) => {
          const isCompleted = isStepCompleted(index);
          const isActive = isStepActive(index);

          return (
            <div key={index} className="flex gap-4">
              {/* Step Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xl
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                {index < SWAP_STEPS.length - 1 && (
                  <div
                    className={`
                      w-0.5 h-12 mt-2
                      ${
                        isCompleted
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }
                    `}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-12">
                <div
                  className={`
                    font-medium
                    ${
                      isActive || isCompleted
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </div>
                {isActive && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <svg
                      className="animate-spin h-4 w-4"
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
                    Processing...
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {/* Polling Toggle */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPolling}
            onChange={(e) => setIsPolling(e.target.checked)}
            className="rounded"
          />
          <span>Auto-refresh status</span>
        </label>
      </div>
    </div>
  );
}
