import { NextResponse } from 'next/server';
import logger from '../../../../lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 10;

interface TimeRange {
  days: number;
  resolution: string;
}

const TIME_RANGES: Record<string, TimeRange> = {
  '7d': { days: 7, resolution: '1d' },
  '30d': { days: 30, resolution: '1d' },
  '90d': { days: 90, resolution: '1d' },
  '180d': { days: 180, resolution: '1d' },
  '365d': { days: 365, resolution: '1d' }
};

interface HashrateData {
  timestamp: number;
  hashrate_kh: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    if (!TIME_RANGES[range]) {
      throw new Error('Invalid time range');
    }

    const { days, resolution } = TIME_RANGES[range];
    const end = Date.now();
    const start = end - (days * 24 * 60 * 60 * 1000);

    const url = new URL('https://api.kaspa.org/info/hashrate/history');
    url.searchParams.append('resolution', resolution);
    const response = await fetch(url);

    if (!response.ok) {
      logger.error('Kaspa API error:', {
        status: response.status,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HashrateData[] = await response.json();
    
    // Filter data based on the requested time range
    const filteredData = data.filter((item: HashrateData) => {
      return item.timestamp >= start && item.timestamp <= end;
    });

    // Convert the data to the expected format
    const result = [{
      metric: {
        __name__: 'network_hash_rate_GHps'
      },
      values: filteredData.map((item: HashrateData) => [
        (item.timestamp / 1000).toString(), // Convert to seconds
        (item.hashrate_kh / 1e6).toString() // Convert from KH/s to GH/s
      ])
    }];

    return NextResponse.json({
      status: 'success',
      data: {
        resultType: 'matrix',
        result: result
      }
    });

  } catch (error) {
    logger.error('Error fetching hashrate history:', { error });
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch hashrate history' },
      { status: 500 }
    );
  }
}
