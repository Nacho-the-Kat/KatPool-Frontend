import { NextResponse } from 'next/server';

export const revalidate = 10;

interface TimeRange {
  days: number;
}

const TIME_RANGES: Record<string, TimeRange> = {
  '7d': { days: 7 },
  '30d': { days: 30 },
  '90d': { days: 90 },
  '180d': { days: 180 },
  '365d': { days: 365 }
};

interface HashrateData {
  timestamp: string;
  median_hashrate: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    if (!TIME_RANGES[range]) {
      throw new Error('Invalid time range');
    }

    const { days } = TIME_RANGES[range];
    const end = Math.floor(Date.now() / 1000);
    const start = end - (days * 24 * 60 * 60);

    const url = new URL('http://kas.katpool.xyz:8080/hashrate/');
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    const data: HashrateData[] = responseData.data;
    
    // Filter data based on the requested time range
    const filteredData = data.filter((item: HashrateData) => {
      const timestamp = parseInt(item.timestamp);
      return timestamp >= start && timestamp <= end;
    });

    // Convert the data to the expected format
    const result = [{
      metric: {
        __name__: 'network_hash_rate_GHps'
      },
      values: filteredData.map((item: HashrateData) => [
        item.timestamp,
        (item.median_hashrate / 1e9).toString() // Convert to GH/s
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
    console.error('Error fetching hashrate history:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch hashrate history' },
      { status: 500 }
    );
  }
}
