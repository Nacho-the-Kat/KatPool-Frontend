import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query');
    url.searchParams.append('query', 'active_workers_10m_count');

    const response = await fetch(url);

    if (!response.ok) {
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
    console.error('Error fetching miner types:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch miner types' },
      { status: 500 }
    );
  }
} 