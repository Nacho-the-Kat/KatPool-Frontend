import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

  try {
    // TODO: May remove `asic_type!=""` filter once backend consistently includes `asic_type` in all metrics
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query');
    url.searchParams.append(
      'query',
      'active_workers_10m_count{asic_type!=""} != 0'
    );
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

    // Count miners by ASIC type
    const minerTypeCount: { [key: string]: number } = {};
    
    data.data.result.forEach((item: any) => {
      const asicType = item.metric.asic_type;
      // All returned miners are active, so just count them
      minerTypeCount[asicType] = (minerTypeCount[asicType] || 0) + 1;
    });

    // Sort by count in descending order
    const sortedTypes = Object.entries(minerTypeCount)
      .sort(([, a], [, b]) => b - a)
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