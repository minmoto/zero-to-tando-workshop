'use client';

import { useRouter } from 'next/navigation';
import { StoredSwap, SwapState, PaymentRail } from '../types';

interface SwapCardProps {
  swap: StoredSwap;
}

export function SwapCard({ swap }: SwapCardProps) {
  const router = useRouter();

  const formatNumber = (num: string): string => {
    if (!num) return '0';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  const getStatusInfo = (state: SwapState): { label: string; color: string; bgColor: string } => {
    switch (state) {
      case SwapState.COMPLETED:
        return {
          label: 'Completed',
          color: 'text-green-700 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-800'
        };
      case SwapState.CANCELLED:
        return {
          label: 'Cancelled',
          color: 'text-red-700 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-800'
        };
      case SwapState.DISPUTED:
        return {
          label: 'Disputed',
          color: 'text-orange-700 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
        };
      case SwapState.CREATED:
        return {
          label: 'Pending Agent',
          color: 'text-yellow-700 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
        };
      case SwapState.ESCROW_PENDING:
        return {
          label: 'Escrow Payment Pending',
          color: 'text-yellow-700 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
        };
      default:
        return {
          label: 'Processing',
          color: 'text-blue-700 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
        };
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const statusInfo = getStatusInfo(swap.state);

  const handleClick = () => {
    router.push(`/swap/${swap.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`View swap ${swap.reference}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {swap.reference}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(swap.createdAt)}
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">You sent</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatNumber(swap.bitcoinAmount)} sats
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">You received</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            KES {formatNumber(swap.fiatAmount)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            {getPaymentMethodLabel(swap.paymentChannel)}
          </span>
          <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
}
