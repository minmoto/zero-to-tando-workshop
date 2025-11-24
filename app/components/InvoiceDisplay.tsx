'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { SwapResponse } from '../types';

interface InvoiceDisplayProps {
  swap: SwapResponse;
  onPaymentComplete: () => void;
}

export function InvoiceDisplay({ swap, onPaymentComplete }: InvoiceDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const invoice = swap.escrowInvoice || '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const checkPaymentStatus = async () => {
    setIsPolling(true);

    try {
      // Mock payment check - replace with actual API call
      // const response = await fetch(`/api/swap/${swap.id}/escrow-status`);
      // const data = await response.json();

      // For now, simulate check
      setTimeout(() => {
        setIsPolling(false);
        // If paid, call onPaymentComplete()
        // For demo, we'll let user manually proceed
      }, 1000);
    } catch (error) {
      console.error('Failed to check payment status:', error);
      setIsPolling(false);
    }
  };

  const formatNumber = (num: string): string => {
    if (!num) return '0';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatInvoice = (invoice: string): string => {
    if (invoice.length <= 20) return invoice;
    return `${invoice.slice(0, 10)}...${invoice.slice(-10)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Pay Lightning Invoice
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Scan QR code or copy the invoice to your Lightning wallet
        </p>
      </div>

      {/* Amount Display */}
      <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white text-center">
        <div className="text-sm text-blue-100 mb-1">Amount to send</div>
        <div className="text-3xl font-bold">{formatNumber(swap.bitcoinAmount)} sats</div>
        <div className="text-sm text-blue-100 mt-2">
          ≈ KES {formatNumber(swap.fiatAmount)}
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={invoice}
            size={256}
            level="M"
            includeMargin={true}
          />
        </div>
      </div>

      {/* Invoice String */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Lightning Invoice
        </label>
        <div className="relative">
          <input
            type="text"
            value={invoice}
            readOnly
            className="w-full px-4 py-3 pr-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatInvoice(invoice)}
        </p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          How to pay
        </h3>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              1
            </span>
            <span>Open your Lightning wallet (e.g., Zeus, Phoenix, Breez)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              2
            </span>
            <span>Scan the QR code or paste the invoice</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              3
            </span>
            <span>Confirm the payment in your wallet</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              4
            </span>
            <span>Wait for payment confirmation</span>
          </li>
        </ol>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex gap-3">
          <div className="text-yellow-600 dark:text-yellow-500 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium">
              Payment Required
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              This invoice must be paid to proceed with the swap. The exchange rate is locked once payment is confirmed.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={checkPaymentStatus}
          disabled={isPolling}
          className="w-full px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPolling ? (
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
              Checking...
            </>
          ) : (
            'Check Payment Status'
          )}
        </button>

        <button
          onClick={onPaymentComplete}
          className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          I&apos;ve Paid - Continue to Tracking
        </button>
      </div>

      {/* Swap Reference */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Swap Reference: <span className="font-mono">{swap.reference}</span>
        </p>
      </div>
    </div>
  );
}
