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
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Use provided start/end times or default to last hour
    const endTime = end ? parseInt(end) : Math.floor(Date.now() / 1000);
    const startTime = start ? parseInt(start) : endTime - (60 * 60); // Default to last hour

    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    
    // Query for active workers count over 10-minute periods, filtering out inactive workers and those without ASIC type
    const query = `active_workers_10m_count{wallet_address="${wallet}", asic_type!=""} != 0`;
    url.searchParams.append('query', query);
    url.searchParams.append('start', startTime.toString());
    url.searchParams.append('end', endTime.toString());

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

    if (data.status === 'success') {
      return NextResponse.json({
        status: 'success',
        data: data.data
      });
    }

    logger.error('Active workers API response error:', {
      query: url.searchParams.get('query'),
      result: data,
      traceId
    });

    return NextResponse.json({
      status: 'error',
      error: 'Failed to fetch active workers data'
    });
  } catch (error) {
    logger.error('Error in active workers API:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch active workers data' },
      { status: 500 }
    );
  }
}
