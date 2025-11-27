'use client';

import {
  PaymentRail,
  SwapFormData,
  MobileMoneyDetails,
  BankTransferDetails,
  CardDetails
} from '../types';

interface ConfirmationScreenProps {
  formData: SwapFormData;
  onConfirm: () => void;
  onBack: () => void;
  isCreating: boolean;
}

export function ConfirmationScreen({
  formData,
  onConfirm,
  onBack,
  isCreating
}: ConfirmationScreenProps) {
  const formatNumber = (num: string): string => {
    if (!num) return '0';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getPaymentRailLabel = (rail: PaymentRail): string => {
    switch (rail) {
      case PaymentRail.MOBILE_MONEY:
        return 'Mobile Money (M-Pesa)';
      case PaymentRail.BANK_TRANSFER:
        return 'Bank Transfer';
      case PaymentRail.CARD:
        return 'Card';
      default:
        return '';
    }
  };

  const renderDestinationDetails = () => {
    switch (formData.paymentRail) {
      case PaymentRail.MOBILE_MONEY: {
        const details = formData.destinationDetails as MobileMoneyDetails;
        return (
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Phone Number
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {details.phoneNumber}
            </div>
          </div>
        );
      }

      case PaymentRail.BANK_TRANSFER: {
        const details = formData.destinationDetails as BankTransferDetails;
        return (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bank Name
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {details.bankName}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Account Number
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {details.accountNumber}
              </div>
            </div>
            {details.accountName && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Account Name
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {details.accountName}
                </div>
              </div>
            )}
          </div>
        );
      }

      case PaymentRail.CARD: {
        const details = formData.destinationDetails as CardDetails;
        const maskedCard = details.cardNumber
          ? details.cardNumber.replace(/\d(?=\d{4})/g, '*')
          : '';
        return (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Card Number
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {maskedCard}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Expiry
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {details.expiryMonth}/{details.expiryYear}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Confirm your swap
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review the details before proceeding
        </p>
      </div>

      <div className="space-y-4">
        {/* Amount Summary */}
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-blue-100">You send</div>
              <div className="text-3xl font-bold">
                {formatNumber(formData.satoshiAmount)} sats
              </div>
            </div>
            <div className="border-t border-blue-400 pt-3">
              <div className="text-sm text-blue-100">You receive</div>
              <div className="text-3xl font-bold">
                KES {formatNumber(formData.fiatAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Payment Method
          </div>
          <div className="text-lg font-medium text-gray-900 dark:text-white">
            {getPaymentRailLabel(formData.paymentRail)}
          </div>
        </div>

        {/* Destination Details */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Destination
          </div>
          {renderDestinationDetails()}
        </div>

        {/* Exchange Rate */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Exchange Rate
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              1 BTC = KES {formatNumber(formData.exchangeRate.toString())}
            </span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex gap-3">
          <div className="text-yellow-600 dark:text-yellow-500 mt-0.5">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium">
              Important
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              Once you click {"Create Swap"}, you&apos;ll receive a Lightning invoice.
              You must pay this invoice to lock in the exchange rate and proceed with the swap.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isCreating}
          className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={isCreating}
          className="flex-1 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              Creating...
            </>
          ) : (
            'Create Swap'
          )}
        </button>
      </div>
    </div>
  );
}
