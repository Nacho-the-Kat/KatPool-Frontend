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

    // Calculate timestamps for last 48 hours with 12-hour steps
    const end = Math.floor(Date.now() / 1000);
    const start = end - (48 * 60 * 60); // 48 hours ago
    const step = 12 * 60 * 60; // 12 hour steps

    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    
    // Construct and encode the full query parameter
    const queryString = `jobs_not_found_1min_count{pool_address="${wallet}"}`;
    url.searchParams.append('query', queryString);
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
        statusText: response.statusText,
        url: url.toString(),
        traceId
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error('Error in miner jobs not found API:', { error, traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner jobs not found' },
      { status: 500 }
    );
  }
} 