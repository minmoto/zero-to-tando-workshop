'use client';

import { PaymentRail } from '../types';

interface PaymentRailOption {
  value: PaymentRail;
  label: string;
  description: string;
  icon: string;
}

const PAYMENT_RAILS: PaymentRailOption[] = [
  {
    value: PaymentRail.MOBILE_MONEY,
    label: 'Mobile Money',
    description: 'M-Pesa',
    icon: '📱'
  },
  {
    value: PaymentRail.BANK_TRANSFER,
    label: 'Bank Transfer',
    description: 'Direct bank deposit',
    icon: '🏦'
  },
  {
    value: PaymentRail.CARD,
    label: 'Card',
    description: 'Debit/Credit card',
    icon: '💳'
  }
];

interface PaymentRailSelectorProps {
  selected?: PaymentRail;
  onSelect: (rail: PaymentRail) => void;
}

export function PaymentRailSelector({ selected, onSelect }: PaymentRailSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          How do you want to receive money?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select your preferred payment method
        </p>
      </div>

      <div className="grid gap-3">
        {PAYMENT_RAILS.map((rail) => (
          <button
            key={rail.value}
            onClick={() => onSelect(rail.value)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200
              flex items-center gap-4 text-left
              ${
                selected === rail.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            aria-pressed={selected === rail.value}
            aria-label={`Select ${rail.label}`}
          >
            <div className="text-3xl" role="img" aria-label={rail.label}>
              {rail.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                {rail.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {rail.description}
              </div>
            </div>
            {selected === rail.value && (
              <div className="text-blue-500" role="img" aria-label="Selected">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
