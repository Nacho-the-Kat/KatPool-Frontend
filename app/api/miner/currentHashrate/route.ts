import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 10;

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

    // Get last 5 minutes of data with 30-second intervals for accurate current hashrate
    const end = Math.floor(Date.now() / 1000);
    const start = end - (5 * 60); // Last 5 minutes
    const step = 30; // 30-second intervals

    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    url.searchParams.append('query', `sum(miner_hash_rate_GHps{wallet_address="${wallet}"})`);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.data?.result?.[0]?.values) {
      const values = data.data.result[0].values;
      const requiredPoints = 10; // We expect 10 points over 5 minutes with 30-second intervals

      // If we have no data at all, return 0
      if (values.length === 0) {
        return NextResponse.json({
          status: 'success',
          data: {
            result: [{
              value: [Date.now() / 1000, "0"]
            }]
          }
        });
      }

      // If we have some data but not enough points, pad with zeros
      const paddedValues = [...values];
      while (paddedValues.length < requiredPoints) {
        paddedValues.push([0, "0"]);
      }

      // Calculate average using all points (including padding if necessary)
      const sum = paddedValues.reduce((acc: number, [_, value]: [number, string]) => acc + Number(value), 0);
      const average = sum / requiredPoints;

      return NextResponse.json({
        status: 'success',
        data: {
          result: [{
            value: [Date.now() / 1000, average.toString()]
          }]
        }
      });
    }

    logger.info('Current hashrate response:', {
      query: url.searchParams.get('query'),
      result: data.data?.result,
      traceId
    });

    return NextResponse.json({
      status: 'success',
      data: data.data
    });
  } catch (error) {
    logger.error('Error fetching current hashrate:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch current hashrate' },
      { status: 500 }
    );
  }
} 