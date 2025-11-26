'use client';

import { useState, useEffect } from 'react';
import {
  PaymentRail,
  OfframpStep,
  SwapFormData,
  DestinationDetails,
  SwapResponse,
  SwapType,
  SwapState,
  Currency
} from './types';
import { PaymentRailSelector } from './components/PaymentRailSelector';
import { DestinationInput } from './components/DestinationInput';
import { AmountInput } from './components/AmountInput';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { InvoiceDisplay } from './components/InvoiceDisplay';
import { SwapTracker } from './components/SwapTracker';
import { fxRatesService } from './services/fxRatesService';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<OfframpStep>(OfframpStep.SELECT_PAYMENT_RAIL);
  const [formData, setFormData] = useState<Partial<SwapFormData>>({
    exchangeRate: 0 // Will be fetched from API
  });
  const [createdSwap, setCreatedSwap] = useState<SwapResponse | null>(null);
  const [isCreatingSwap, setIsCreatingSwap] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  // Fetch initial exchange rate and set up polling
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const rate = await fxRatesService.getBtcToFiatRate('KES');
        setFormData(prev => ({ ...prev, exchangeRate: rate }));
        setIsLoadingRate(false);
      } catch (error) {
        console.error('Failed to fetch initial exchange rate:', error);
        setIsLoadingRate(false);
      }
    };

    fetchRate();

    // Poll for rate updates every 30 seconds
    const intervalId = setInterval(fetchRate, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Step: Select Payment Rail
  const handlePaymentRailSelect = (rail: PaymentRail) => {
    setFormData({ ...formData, paymentRail: rail });
    setCurrentStep(OfframpStep.ENTER_DESTINATION);
  };

  // Step: Enter Destination
  const handleDestinationChange = (details: DestinationDetails) => {
    setFormData({ ...formData, destinationDetails: details });
  };

  const handleDestinationContinue = () => {
    if (formData.destinationDetails) {
      setCurrentStep(OfframpStep.ENTER_AMOUNT);
    }
  };

  // Step: Enter Amount
  const handleFiatChange = (fiat: string, sats: string) => {
    setFormData({ ...formData, fiatAmount: fiat, satoshiAmount: sats });
  };

  const handleSatoshiChange = (sats: string, fiat: string) => {
    setFormData({ ...formData, satoshiAmount: sats, fiatAmount: fiat });
  };

  const handleAmountContinue = () => {
    if (formData.fiatAmount && formData.satoshiAmount) {
      setCurrentStep(OfframpStep.CONFIRM_DETAILS);
    }
  };

  // Step: Confirmation
  const handleConfirmSwap = async () => {
    setIsCreatingSwap(true);

    try {
      // Mock API call to create swap
      // In production, this would call the MINMO API
      // const response = await fetch('/api/swap', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     type: SwapType.OFFRAMP,
      //     fiatAmount: formData.fiatAmount,
      //     fiatCurrency: Currency.KES,
      //     paymentChannel: formData.paymentRail,
      //     userPaymentDetails: formData.destinationDetails,
      //     agentMargin: 0
      //   })
      // });
      // const swap = await response.json();

      // Mock swap response for demo
      const mockSwap: SwapResponse = {
        id: `swap-${Date.now()}`,
        reference: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
        type: SwapType.OFFRAMP,
        state: SwapState.CREATED,
        fiatAmount: formData.fiatAmount!,
        fiatCurrency: Currency.KES,
        bitcoinAmount: formData.satoshiAmount!,
        exchangeRate: formData.exchangeRate!.toString(),
        paymentChannel: formData.paymentRail!,
        escrowInvoice: 'lnbc' + Math.random().toString(36).substring(2, 15) + '...',
        createdAt: new Date().toISOString(),
        userPaymentDetails: formData.destinationDetails as unknown as Record<string, unknown>
      };

      setTimeout(() => {
        setCreatedSwap(mockSwap);
        setIsCreatingSwap(false);
        setCurrentStep(OfframpStep.DISPLAY_INVOICE);
      }, 1500); // Simulate API delay
    } catch (error) {
      console.error('Failed to create swap:', error);
      setIsCreatingSwap(false);
      // Handle error (show error message to user)
    }
  };

  // Step: Invoice Display
  const handlePaymentComplete = () => {
    setCurrentStep(OfframpStep.TRACK_SWAP);
  };

  // Step: Tracking
  const handleNewSwap = () => {
    setFormData({ exchangeRate: formData.exchangeRate || 0 });
    setCreatedSwap(null);
    setCurrentStep(OfframpStep.SELECT_PAYMENT_RAIL);
  };

  // Navigation
  const handleBack = () => {
    switch (currentStep) {
      case OfframpStep.ENTER_DESTINATION:
        setCurrentStep(OfframpStep.SELECT_PAYMENT_RAIL);
        break;
      case OfframpStep.ENTER_AMOUNT:
        setCurrentStep(OfframpStep.ENTER_DESTINATION);
        break;
      case OfframpStep.CONFIRM_DETAILS:
        setCurrentStep(OfframpStep.ENTER_AMOUNT);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Send Bitcoin, receive local currency
          </p>
        </div>

        {/* Progress Indicator */}
        {currentStep !== OfframpStep.TRACK_SWAP && (
          <div className="mb-8">
            <div className="flex justify-center gap-2">
              {[
                OfframpStep.SELECT_PAYMENT_RAIL,
                OfframpStep.ENTER_DESTINATION,
                OfframpStep.ENTER_AMOUNT,
                OfframpStep.CONFIRM_DETAILS,
                OfframpStep.DISPLAY_INVOICE
              ].map((step, index) => {
                const stepIndex = Object.values(OfframpStep).indexOf(step);
                const currentIndex = Object.values(OfframpStep).indexOf(currentStep);
                const isActive = stepIndex === currentIndex;
                const isCompleted = stepIndex < currentIndex;

                return (
                  <div
                    key={step}
                    className={`
                      h-2 rounded-full transition-all duration-300
                      ${index === 0 ? 'w-8' : index === 4 ? 'w-8' : 'w-12'}
                      ${
                        isCompleted
                          ? 'bg-blue-500'
                          : isActive
                            ? 'bg-blue-400'
                            : 'bg-gray-200 dark:bg-gray-700'
                      }
                    `}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {currentStep === OfframpStep.SELECT_PAYMENT_RAIL && (
            <PaymentRailSelector
              selected={formData.paymentRail}
              onSelect={handlePaymentRailSelect}
            />
          )}

          {currentStep === OfframpStep.ENTER_DESTINATION && formData.paymentRail && (
            <div className="space-y-6">
              <DestinationInput
                paymentRail={formData.paymentRail}
                value={formData.destinationDetails}
                onChange={handleDestinationChange}
                onBack={handleBack}
              />
              <button
                onClick={handleDestinationContinue}
                disabled={!formData.destinationDetails}
                className={`
                  w-full px-6 py-3 rounded-lg font-medium transition-colors
                  ${
                    formData.destinationDetails
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === OfframpStep.ENTER_AMOUNT && (
            <AmountInput
              fiatAmount={formData.fiatAmount || ''}
              satoshiAmount={formData.satoshiAmount || ''}
              exchangeRate={formData.exchangeRate || 0}
              onFiatChange={handleFiatChange}
              onSatoshiChange={handleSatoshiChange}
              onBack={handleBack}
              onContinue={handleAmountContinue}
            />
          )}

          {currentStep === OfframpStep.CONFIRM_DETAILS && (
            <ConfirmationScreen
              formData={formData as SwapFormData}
              onConfirm={handleConfirmSwap}
              onBack={handleBack}
              isCreating={isCreatingSwap}
            />
          )}

          {currentStep === OfframpStep.DISPLAY_INVOICE && createdSwap && (
            <InvoiceDisplay
              swap={createdSwap}
              onPaymentComplete={handlePaymentComplete}
            />
          )}

          {currentStep === OfframpStep.TRACK_SWAP && createdSwap && (
            <SwapTracker
              swap={createdSwap}
              onNewSwap={handleNewSwap}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by the MINMO API</p>
        </div>
      </div>
    </div>
  );
}
