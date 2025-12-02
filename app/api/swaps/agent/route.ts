import { NextRequest, NextResponse } from 'next/server';

const SWAP_API_URL = process.env.SWAP_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
const AGENT_ID = process.env.AGENT_ID || '';

export async function GET(request: NextRequest) {
  try {
    if (!AGENT_ID) {
      return NextResponse.json(
        { error: 'Agent ID not configured' },
        { status: 500 }
      );
    }

    // Get beneficiaryId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const beneficiaryId = searchParams.get('beneficiaryId');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    // Build API URL with optional beneficiaryId query parameter
    const apiUrl = new URL(`${SWAP_API_URL}/swap/agent/${AGENT_ID}`);
    if (beneficiaryId) {
      apiUrl.searchParams.set('beneficiaryId', beneficiaryId);
    }

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Swap API error response:', errorText);
      console.error('Response status:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch swaps', message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Swap fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
