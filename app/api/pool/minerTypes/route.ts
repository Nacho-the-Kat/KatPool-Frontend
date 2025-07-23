import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

  try {
    // Use query_range to get data for the last 10 minutes
    const end = Math.floor(Date.now() / 1000);
    const start = end - (10 * 60); // Last 10 minutes
    const step = 10; // 1-minute intervals

    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    url.searchParams.append('query', 'active_workers_10m_count');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());
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
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data?.result) {
      throw new Error('Invalid response format');
    }

    // Count miners by ASIC type using the latest value in the time series
    const minerTypeCount: { [key: string]: number } = {};
    data.data.result.forEach((item: any) => {
      let asicType = item.metric.asic_type;
      if (!asicType) {
        asicType = 'Other';
      }
      // Use the latest value in the time series
      const latestValue = item.values[item.values.length - 1]?.[1];
      if (Number(latestValue) > 0) {
        minerTypeCount[asicType] = (minerTypeCount[asicType] || 0) + 1;
      }
    });

    // Sort by count in descending order
    const sortedTypes = Object.entries(minerTypeCount)
      // sort by count in descending order, but put Other at the end
      .sort(([keyA, a], [keyB, b]) => {
        if (keyA === 'Other') return 1;
        if (keyB === 'Other') return -1;
        return b - a;
      })
      .reduce((acc, [key, value]) => {
        acc.labels.push(key);
        acc.values.push(value);
        return acc;
      }, { labels: [] as string[], values: [] as number[] });

    return NextResponse.json({
      status: 'success',
      data: sortedTypes
    });

  } catch (error) {
    logger.error('Error fetching miner types:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch miner types' },
      { status: 500 }
    );
  }
} 