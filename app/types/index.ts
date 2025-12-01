// Payment rail types
export enum PaymentRail {
  MOBILE_MONEY = 'mpesa_phone',
  BANK_TRANSFER = 'bank_transfer',
}

export enum SwapType {
  OFFRAMP = 'offramp'
}

export enum SwapState {
  CREATED = 'created',
  AGENT_MATCHED = 'agent_matched',
  ESCROW_PENDING = 'escrow_pending',
  ESCROW_LOCKED = 'escrow_locked',
  PAYMENT_INSTRUCTED = 'payment_instructed',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_SUBMITTED = 'payment_submitted',
  PAYMENT_CONFIRMED_USER = 'payment_confirmed_user',
  PAYMENT_CONFIRMED_AGENT = 'payment_confirmed_agent',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export enum Currency {
  BTC = 'BTC',
  KES = 'KES',
  USD = 'USD'
}

// Destination details based on payment rail
export interface MobileMoneyDetails {
  phoneNumber: string;
}

export interface BankTransferDetails {
  bankName: string;
  accountNumber: string;
  accountName?: string;
}

export type DestinationDetails =
  | MobileMoneyDetails
  | BankTransferDetails

// Swap creation data
export interface SwapFormData {
  paymentRail: PaymentRail;
  destinationDetails: DestinationDetails;
  fiatAmount: string;
  satoshiAmount: string;
  exchangeRate: number;
}

// API response types
export interface ExchangeRateResponse {
  rate: number;
  currency: string;
  timestamp: string;
}

export interface FxRateResponse {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  timestamp: string;
  source?: string;
}

export interface SwapResponse {
  id: string;
  reference: string;
  type: SwapType;
  state: SwapState;
  fiatAmount: string;
  fiatCurrency: Currency;
  bitcoinAmount: string;
  exchangeRate: string;
  paymentChannel: string;
  escrowInvoice?: string;
  createdAt: string;
  agentPaymentDetails?: Record<string, unknown>;
  userPaymentDetails?: Record<string, unknown>;
}

// Flow steps
export enum OfframpStep {
  SELECT_PAYMENT_RAIL = 'select_payment_rail',
  ENTER_DESTINATION = 'enter_destination',
  ENTER_AMOUNT = 'enter_amount',
  CONFIRM_DETAILS = 'confirm_details',
  SWAP_CONFIRMATION = 'swap_confirmation',
  DISPLAY_INVOICE = 'display_invoice',
  TRACK_SWAP = 'track_swap'
}

// Swap history filter and sort options
export type SwapFilterOption = 'all' | 'pending' | 'completed';
export type SwapSortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

// Stored swap interface for localStorage
export interface StoredSwap extends SwapResponse {
  beneficiaryId: string;
  savedAt: string;
}

// Swap history state
export interface SwapHistoryState {
  swaps: StoredSwap[];
  filter: SwapFilterOption;
  sort: SwapSortOption;
}

// Swap storage interface
export interface SwapStorage {
  saveSwap: (swap: SwapResponse, beneficiaryId: string) => void;
  getSwaps: (beneficiaryId?: string) => StoredSwap[];
  getSwapById: (id: string) => StoredSwap | null;
  clearSwaps: () => void;
}
