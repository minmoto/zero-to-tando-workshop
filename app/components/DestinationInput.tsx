'use client';

import { useState } from 'react';
import {
  PaymentRail,
  MobileMoneyDetails,
  BankTransferDetails,
  CardDetails,
  DestinationDetails
} from '../types';

interface DestinationInputProps {
  paymentRail: PaymentRail;
  value?: DestinationDetails;
  onChange: (details: DestinationDetails) => void;
  onBack: () => void;
}

export function DestinationInput({
  paymentRail,
  value,
  onChange,
  onBack
}: DestinationInputProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhoneNumber = (phone: string): boolean => {
    // Kenyan phone number validation (basic)
    const cleaned = phone.replace(/\s/g, '');
    return /^(\+?254|0)[17]\d{8}$/.test(cleaned);
  };

  const validateAccountNumber = (account: string): boolean => {
    return account.length >= 6 && /^\d+$/.test(account);
  };

  const validateCardNumber = (card: string): boolean => {
    const cleaned = card.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const handleMobileMoneyChange = (phoneNumber: string) => {
    const newErrors = { ...errors };

    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    } else {
      delete newErrors.phoneNumber;
    }

    setErrors(newErrors);
    onChange({ phoneNumber } as MobileMoneyDetails);
  };

  const handleBankTransferChange = (field: keyof BankTransferDetails, value: string) => {
    const current = (value as BankTransferDetails) || {
      bankName: '',
      accountNumber: '',
      accountName: ''
    };

    const updated = { ...current, [field]: value };
    const newErrors = { ...errors };

    if (field === 'accountNumber' && value && !validateAccountNumber(value)) {
      newErrors.accountNumber = 'Invalid account number';
    } else if (field === 'accountNumber') {
      delete newErrors.accountNumber;
    }

    setErrors(newErrors);
    onChange(updated as BankTransferDetails);
  };

  const handleCardChange = (field: keyof CardDetails, value: string) => {
    const current = (value as CardDetails) || {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: ''
    };

    const updated = { ...current, [field]: value };
    const newErrors = { ...errors };

    if (field === 'cardNumber' && value && !validateCardNumber(value)) {
      newErrors.cardNumber = 'Invalid card number';
    } else if (field === 'cardNumber') {
      delete newErrors.cardNumber;
    }

    setErrors(newErrors);
    onChange(updated as CardDetails);
  };

  const renderMobileMoneyInput = () => {
    const details = value as MobileMoneyDetails | undefined;

    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            M-Pesa Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={details?.phoneNumber || ''}
            onChange={(e) => handleMobileMoneyChange(e.target.value)}
            placeholder="0712345678 or +254712345678"
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
          />
          {errors.phoneNumber && (
            <p id="phoneNumber-error" className="mt-1 text-sm text-red-500">
              {errors.phoneNumber}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderBankTransferInput = () => {
    const details = value as BankTransferDetails | undefined;

    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="bankName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Bank Name
          </label>
          <select
            id="bankName"
            value={details?.bankName || ''}
            onChange={(e) => handleBankTransferChange('bankName', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your bank</option>
            <option value="Equity Bank">Equity Bank</option>
            <option value="KCB">KCB</option>
            <option value="Cooperative Bank">Cooperative Bank</option>
            <option value="NCBA">NCBA</option>
            <option value="Absa">Absa</option>
            <option value="Standard Chartered">Standard Chartered</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Account Number
          </label>
          <input
            id="accountNumber"
            type="text"
            value={details?.accountNumber || ''}
            onChange={(e) => handleBankTransferChange('accountNumber', e.target.value)}
            placeholder="Enter account number"
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-invalid={!!errors.accountNumber}
            aria-describedby={errors.accountNumber ? 'accountNumber-error' : undefined}
          />
          {errors.accountNumber && (
            <p id="accountNumber-error" className="mt-1 text-sm text-red-500">
              {errors.accountNumber}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="accountName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Account Name (Optional)
          </label>
          <input
            id="accountName"
            type="text"
            value={details?.accountName || ''}
            onChange={(e) => handleBankTransferChange('accountName', e.target.value)}
            placeholder="Enter account name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

  const renderCardInput = () => {
    const details = value as CardDetails | undefined;

    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            value={details?.cardNumber || ''}
            onChange={(e) => {
              const formatted = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
              handleCardChange('cardNumber', formatted);
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-invalid={!!errors.cardNumber}
            aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
          />
          {errors.cardNumber && (
            <p id="cardNumber-error" className="mt-1 text-sm text-red-500">
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiryMonth"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Expiry Month
            </label>
            <input
              id="expiryMonth"
              type="text"
              value={details?.expiryMonth || ''}
              onChange={(e) => handleCardChange('expiryMonth', e.target.value)}
              placeholder="MM"
              maxLength={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="expiryYear"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Expiry Year
            </label>
            <input
              id="expiryYear"
              type="text"
              value={details?.expiryYear || ''}
              onChange={(e) => handleCardChange('expiryYear', e.target.value)}
              placeholder="YY"
              maxLength={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderInput = () => {
    switch (paymentRail) {
      case PaymentRail.MOBILE_MONEY:
        return renderMobileMoneyInput();
      case PaymentRail.BANK_TRANSFER:
        return renderBankTransferInput();
      case PaymentRail.CARD:
        return renderCardInput();
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Enter destination details
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Where should we send your money?
        </p>
      </div>

      {renderInput()}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
