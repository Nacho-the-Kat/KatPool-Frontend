import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    // Get last 5 minutes of data with 1-minute intervals for accurate current hashrate
    const end = Math.floor(Date.now() / 1000);
    const start = end - (5 * 60); // Last 5 minutes
    const step = 60; // 1-minute intervals

    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const url = new URL(`${baseUrl}/api/v1/query_range`);
    url.searchParams.append('query', 'pool_hash_rate_GHps');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Always return a valid response format
    if (data.status === 'success') {
      if (data.data?.result?.[0]?.values?.length > 0) {
        // Calculate average of last 5 minutes for stability
        const values = data.data.result[0].values;
        const sum = values.reduce((acc: number, [_, value]: [number, string]) => acc + Number(value), 0);
        const average = sum / values.length;

        return NextResponse.json({
          status: 'success',
          data: {
            result: [{
              value: [Date.now() / 1000, average.toString()]
            }]
          }
        });
      } else {
        // Return 0 if no data points are available
        return NextResponse.json({
          status: 'success',
          data: {
            result: [{
              value: [Date.now() / 1000, "0"]
            }]
          }
        });
      }
    }

    // If upstream API returns an error status, maintain that error
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying pool hashrate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pool hashrate' },
      { status: 500 }
    );
  }
} 