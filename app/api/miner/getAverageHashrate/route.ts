import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 10;

type TimeRange = '24h' | '5m' | '7d';

interface RangeConfig {
  duration: number; // in seconds
  step: number; // in seconds
}

const RANGE_CONFIGS: Record<TimeRange, RangeConfig> = {
  '24h': { duration: 24 * 60 * 60, step: 60 }, // 24 hours, 1-minute intervals
  '5m': { duration: 5 * 60, step: 15 }, // 5 minutes, 15-second intervals
  '7d': { duration: 7 * 24 * 60 * 60, step: 300 }, // 7 days, 5-minute intervals
};

// TODO: this logic is relative copy of averages route, should be refactored
export async function GET(request: Request) {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || 'unknown';

  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const rangeParam = searchParams.get('range') || '5m';
    
    // Type guard to ensure range is valid
    const range: TimeRange = (rangeParam === '24h' || rangeParam === '5m' || rangeParam === '7d') 
      ? rangeParam as TimeRange 
      : '5m';

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const end = Math.floor(Date.now() / 1000);
    const config = RANGE_CONFIGS[range];
    const start = end - config.duration;

    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    url.searchParams.append(
      'query',
      `sum(miner_hash_rate_GHps{wallet_address="${wallet}"}) by (wallet_address)`
    );
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', config.step.toString());

    const response = await fetch(url, {
      headers: {
        'x-trace-id': traceId || '',
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
      data: average,
      range: range
    });
  } catch (error) {
    logger.error('Error fetching miner getAverageHashrate:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner getAverageHashrate' },
      { status: 500 }
    );
  }
} 