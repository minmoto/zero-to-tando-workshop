export interface FxRateResponse {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  timestamp: string;
  source?: string;
}

export interface FxRatesError {
  error: string;
  message: string;
}

export class FxRatesService {
  private static instance: FxRatesService;
  private rateCache: Map<string, { rate: FxRateResponse; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds cache

  private constructor() {}

  static getInstance(): FxRatesService {
    if (!FxRatesService.instance) {
      FxRatesService.instance = new FxRatesService();
    }
    return FxRatesService.instance;
  }

  private getCacheKey(baseCurrency: string, targetCurrency: string): string {
    return `${baseCurrency}-${targetCurrency}`.toUpperCase();
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getRate(baseCurrency: string, targetCurrency: string): Promise<FxRateResponse> {
    const cacheKey = this.getCacheKey(baseCurrency, targetCurrency);
    const cached = this.rateCache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.rate;
    }

    try {
      // Use Next.js API route to avoid CORS issues
      const response = await fetch(
        `/api/fx/rates/${baseCurrency.toUpperCase()}/${targetCurrency.toUpperCase()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorData.error}`);
      }

      const data: FxRateResponse = await response.json();

      this.rateCache.set(cacheKey, {
        rate: data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Failed to fetch FX rate:', error);
      throw new Error(`Failed to fetch exchange rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBtcToFiatRate(fiatCurrency: string): Promise<number> {
    const rateData = await this.getRate('BTC', fiatCurrency);
    return rateData.rate;
  }

  clearCache(): void {
    this.rateCache.clear();
  }
}

export const fxRatesService = FxRatesService.getInstance();
