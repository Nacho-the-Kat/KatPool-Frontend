import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || 'unknown';

  try {
    // Get data for the last hour to determine truly active miners
    const end = Math.floor(Date.now() / 1000);
    const start = end - (60 * 60); // Last hour
    const step = 300; // 5-minute intervals

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', 'miner_hash_rate_GHps');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Count unique miners that have had any hashrate in the last hour
    const activeMiners = new Set(
      data.data.result
        .filter((miner: any) => {
          // Check if miner had any non-zero hashrate in the period
          return miner.values.some(([_, value]: [number, string]) => Number(value) > 0);
        })
        .map((miner: any) => miner.metric.wallet_address)
    ).size;

    return NextResponse.json({
      status: 'success',
      data: {
        activeMiners
      }
    });

  } catch (error) {
    logger.error('Error fetching active miners:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch active miners' },
      { status: 500 }
    );
  }
} 