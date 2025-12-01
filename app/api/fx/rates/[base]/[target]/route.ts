import { NextRequest, NextResponse } from 'next/server';

const SWAP_API_URL = process.env.SWAP_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ base: string; target: string }> }
) {
  try {
    const { base, target } = await params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const apiUrl = `${SWAP_API_URL}/fx/rates/${base.toUpperCase()}/${target.toUpperCase()}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch FX rate', message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('FX rates API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
