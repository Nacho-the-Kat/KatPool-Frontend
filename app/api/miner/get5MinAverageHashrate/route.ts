import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'edge';
export const revalidate = 10;

// TODO: this logic is relative copy of averages route, should be refactored
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
    const start = end - 5 * 60; // Last 5 minutes
    const step = 15; // 15-second intervals

    const headersList = headers();
    const requestId = headersList.get('x-request-id');
    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    url.searchParams.append(
      'query',
      `sum(miner_hash_rate_GHps{wallet_address="${wallet}"}) by (wallet_address)`
    );
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      headers: {
        'x-request-id': requestId || '',
      },
    });
    const data = await response.json();

    let filteredValues: number[] = [];

    // Filter out 0 values, miner is offline
    if (data.data?.result?.[0]?.values?.length > 0) {
      filteredValues = data.data.result[0].values
        .map(([, value]: [number, string]) => Number(value))
        .filter((v: number) => v !== 0);
    }

    const sum = filteredValues.reduce((acc, val) => acc + val, 0);
    const average = filteredValues.length > 0 ? sum / filteredValues.length : 0;

    return NextResponse.json({
      status: 'success',
      data: average
    });
  } catch (error) {
    console.error('Error fetching miner get5MinAverageHashrate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner get5MinAverageHashrate' },
      { status: 500 }
    );
  }
} 