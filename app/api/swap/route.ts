import { NextRequest, NextResponse } from 'next/server';

const SWAP_API_URL = process.env.SWAP_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
const AGENT_ID = process.env.AGENT_ID || '';

interface CreateSwapRequest {
  type: string;
  fiatAmount: string;
  fiatCurrency: string;
  paymentChannel: string;
  userPaymentDetails: Record<string, unknown>;
  agentMargin?: number;
  agentId?: string;
  agentSelectionMode?: string;
  metadata?: Record<string, unknown>;
  reference?: string;
  agentPaymentDetails?: Record<string, unknown>;
  beneficiaryId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSwapRequest = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const apiUrl = `${SWAP_API_URL}/swap`;

    // Build the request body to match the working payload structure
    const requestBody = {
      type: body.type,
      fiatAmount: body.fiatAmount,
      fiatCurrency: body.fiatCurrency,
      paymentChannel: body.paymentChannel,
      userPaymentDetails: body.userPaymentDetails,
      agentId: AGENT_ID,
      agentMargin: body.agentMargin || 600, // Default to 600 if not provided
      metadata: {
        ...body.metadata,
        exchangeRate: body.metadata?.exchangeRate, // Include exchange rate in metadata
      },
    };

    // Add beneficiaryId if provided
    if (body.beneficiaryId) {
      Object.assign(requestBody, { beneficiaryId: body.beneficiaryId });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Swap API error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      return NextResponse.json(
        { error: 'Failed to create swap', message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Swap creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
