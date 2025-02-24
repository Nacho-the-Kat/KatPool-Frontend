import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const end = Math.floor(Date.now() / 1000);
    const start = end - (48 * 60 * 60); // Last 48 hours
    const step = 300; // 5-minute intervals for detailed data

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', `sum(miner_hash_rate_GHps{wallet_address="${wallet}"}) by (wallet_address)`);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: data.data
    });
  } catch (error) {
    console.error('Error fetching miner averages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner averages' },
      { status: 500 }
    );
  }
} 