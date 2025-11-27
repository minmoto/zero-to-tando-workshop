'use client';

import { useState, useEffect } from 'react';
import { Currency } from '../types';
import { fxRatesService } from '../services/fxRatesService';

interface AmountInputProps {
  fiatAmount: string;
  satoshiAmount: string;
  exchangeRate: number;
  onFiatChange: (fiat: string, sats: string) => void;
  onSatoshiChange: (sats: string, fiat: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const SATOSHIS_PER_BITCOIN = 100_000_000;

export function AmountInput({
  fiatAmount,
  satoshiAmount,
  exchangeRate,
  onFiatChange,
  onSatoshiChange,
  onBack,
  onContinue
}: AmountInputProps) {
  const [activeInput, setActiveInput] = useState<'fiat' | 'sats'>('fiat');
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  // Fetch exchange rate on mount
  useEffect(() => {
    if (exchangeRate === 0) {
      fetchExchangeRate();
    }
  }, []);

  const fetchExchangeRate = async () => {
    setIsLoadingRate(true);
    setRateError(null);

    try {
      const rate = await fxRatesService.getBtcToFiatRate('KES');

      if (fiatAmount) {
        const sats = convertFiatToSats(fiatAmount, rate);
        onFiatChange(fiatAmount, sats);
      }
      setIsLoadingRate(false);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      setRateError('Failed to fetch exchange rate. Please try again.');
      setIsLoadingRate(false);
    }
  };

  const convertFiatToSats = (fiat: string, rate: number): string => {
    if (!fiat || parseFloat(fiat) === 0) return '0';

    const fiatValue = parseFloat(fiat);
    const btcAmount = fiatValue / rate;
    const sats = Math.floor(btcAmount * SATOSHIS_PER_BITCOIN);

    return sats.toString();
  };

  const convertSatsToFiat = (sats: string, rate: number): string => {
    if (!sats || parseInt(sats, 10) === 0) return '0';

    const satsValue = parseInt(sats, 10);
    const btcAmount = satsValue / SATOSHIS_PER_BITCOIN;
    const fiatValue = btcAmount * rate;

    return fiatValue.toFixed(2);
  };

  const handleFiatChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setActiveInput('fiat');

    if (exchangeRate > 0) {
      const sats = convertFiatToSats(value, exchangeRate);
      onFiatChange(value, sats);
    } else {
      onFiatChange(value, '0');
    }
  };

  const handleSatoshiChange = (value: string) => {
    // Allow only integers
    if (value && !/^\d*$/.test(value)) return;

    setActiveInput('sats');

    if (exchangeRate > 0) {
      const fiat = convertSatsToFiat(value, exchangeRate);
      onSatoshiChange(value, fiat);
    } else {
      onSatoshiChange(value, '0');
    }
  };

  const formatNumber = (num: string): string => {
    if (!num) return '';
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const canContinue = () => {
    const fiat = parseFloat(fiatAmount || '0');
    const sats = parseInt(satoshiAmount || '0', 10);
    return fiat > 0 && sats > 0 && exchangeRate > 0 && !isLoadingRate;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          How much do you want to receive?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter amount in KES or sats
        </p>
      </div>

      {rateError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{rateError}</p>
          <button
            onClick={fetchExchangeRate}
            className="mt-2 text-sm text-red-700 dark:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Fiat Amount Input */}
        <div>
          <label
            htmlFor="fiatAmount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Amount in KES
          </label>
          <div className="relative">
            <input
              id="fiatAmount"
              type="text"
              inputMode="decimal"
              value={fiatAmount}
              onChange={(e) => handleFiatChange(e.target.value)}
              placeholder="0.00"
              className={`
                w-full px-4 py-3 pr-16 rounded-lg border
                ${activeInput === 'fiat' ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white text-lg
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900
              `}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              KES
            </span>
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center">
          <div className="text-gray-400 dark:text-gray-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </div>
        </div>

        {/* Satoshi Amount Input */}
        <div>
          <label
            htmlFor="satoshiAmount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Amount in Satoshis
          </label>
          <div className="relative">
            <input
              id="satoshiAmount"
              type="text"
              inputMode="numeric"
              value={satoshiAmount}
              onChange={(e) => handleSatoshiChange(e.target.value)}
              placeholder="0"
              className={`
                w-full px-4 py-3 pr-16 rounded-lg border
                ${activeInput === 'sats' ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white text-lg
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900
              `}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              sats
            </span>
          </div>
        </div>
      </div>

      {/* Exchange Rate Display */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
          {isLoadingRate ? (
            <span className="text-gray-500 dark:text-gray-400">Loading...</span>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              1 BTC = {formatNumber(exchangeRate.toString())} KES
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {parseFloat(fiatAmount || '0') > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            You will send <span className="font-semibold">{formatNumber(satoshiAmount)} sats</span> and receive{' '}
            <span className="font-semibold">KES {formatNumber(fiatAmount)}</span>
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!canContinue()}
          className={`
            flex-1 px-6 py-3 rounded-lg font-medium transition-colors
            ${
              canContinue()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
