import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'edge';
export const revalidate = 10;

function calculateAverages(values: [number, string][]) {
  const now = Date.now() / 1000; // current time in seconds

  const intervals = {
    '5min': 5 * 60,
    '1h': 60 * 60,
    '12h': 12 * 60 * 60,
    '24h': 24 * 60 * 60,
    '48h': 48 * 60 * 60,
  };

  // Initialize sums and counts for each interval
  const sums: { [key: string]: number } = {};
  const counts: { [key: string]: number } = {};
  for (const key in intervals) {
    sums[key] = 0;
    counts[key] = 1;
  }

  for (const [timestamp, valueStr] of values) {
    const value = parseFloat(valueStr);
    if (value === 0) continue; // skip zero values

    const age = now - timestamp;
    for (const key of Object.keys(intervals) as (keyof typeof intervals)[]) {
      if (age <= intervals[key]) {
        sums[key] += value;
        counts[key]++;
      }
    }
  }

  // Calculate averages
  const averages: { [key: string]: number | null } = {};
  for (const key in intervals) {
    averages[key] = counts[key] > 0 ? sums[key] / counts[key] : null;
  }

  return averages;
}


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

    const query = `miner_hash_rate_GHps{wallet_address="${wallet}"}[48h]`;
    const headersList = headers();
    const requestId = headersList.get('x-request-id');
    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query`);
    url.searchParams.append('query', query);
    const response = await fetch(url, {
      headers: {
        'x-request-id': requestId || '',
      },
    });

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const averages = calculateAverages(data.data.result[0].values);

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: averages
    });
  } catch (error) {
    console.error('Error fetching miner averages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner averages' },
      { status: 500 }
    );
  }
} 