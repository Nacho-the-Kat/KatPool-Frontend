import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

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

  // Find earliest timestamp with non-zero value
  let earliestTimestamp = now;
  for (const [timestamp, valueStr] of values) {
    const value = parseFloat(valueStr);
    if (value === 0) continue; // skip zero values
    if (timestamp < earliestTimestamp) {
      earliestTimestamp = timestamp;
    }
  }

  // Calculate activity status for each interval
  const activityStatus: { [key: string]: boolean } = {};
  const timeFrames = ['5min', '1h', '12h', '24h', '48h'] as const;
  
  // First calculate raw activity status
  for (const key of timeFrames) {
    // Count non-zero values within the interval
    let activePoints = 0;
    for (const [timestamp, valueStr] of values) {
      const value = parseFloat(valueStr);
      if (value === 0) continue; // skip zero values
      const age = now - timestamp;
      if (age <= intervals[key]) {
        activePoints++;
      }
    }
    // Consider active if there are any non-zero values in the interval
    activityStatus[key] = activePoints > 0;
  }

  // Enforce hierarchical activity status
  for (let i = timeFrames.length - 1; i > 0; i--) {
    if (activityStatus[timeFrames[i]]) {
      // If current time frame is active, make all shorter time frames active
      for (let j = i - 1; j >= 0; j--) {
        activityStatus[timeFrames[j]] = true;
      }
    }
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

  return {
    averages,
    activityStatus
  };
}


export async function GET(request: Request) {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

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
    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query`);
    url.searchParams.append('query', query);
    const response = await fetch(url, {
      headers: {
        'x-trace-id': traceId || '',
      },
    });

    if (!response.ok) {
      logger.error('Pool API error:', {
        status: response.status,
        url: url.toString(),
        traceId
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if(data.data.result.length === 0) {
      return NextResponse.json({
        status: 'success',
        data: {
          averages: {
            '5min': null,
            '1h': null,
            '12h': null,
            '24h': null,
            '48h': null
          },
          activityStatus: {
            '5min': false,
            '1h': false,
            '12h': false,
            '24h': false,
            '48h': false
          }
        }
      });
    }
    const result = calculateAverages(data.data.result[0].values);

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    logger.error('Error fetching miner averages:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner averages' },
      { status: 500 }
    );
  }
} 