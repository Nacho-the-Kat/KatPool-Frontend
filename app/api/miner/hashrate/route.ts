import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

interface TimeRange {
  days: number;
  recentStepMinutes: number;
  historicalStepHours: number;
}

const TIME_RANGES: Record<string, TimeRange> = {
  '7d': { days: 7, recentStepMinutes: 5, historicalStepHours: 1 },
  '30d': { days: 30, recentStepMinutes: 5, historicalStepHours: 2 },
  '90d': { days: 90, recentStepMinutes: 5, historicalStepHours: 6 },
  '180d': { days: 180, recentStepMinutes: 5, historicalStepHours: 12 },
  '365d': { days: 365, recentStepMinutes: 5, historicalStepHours: 24 }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const range = searchParams.get('range') || '7d';

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!TIME_RANGES[range]) {
      throw new Error('Invalid time range');
    }

    const { days, recentStepMinutes, historicalStepHours } = TIME_RANGES[range];
    const endTime = Math.floor(Date.now() / 1000);
    const recentStartTime = endTime - (2 * 60 * 60); // Last 2 hours
    const startTime = endTime - (days * 24 * 60 * 60);

    // Fetch recent data (5-minute intervals)
    const recentUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    const recentQuery = `sum(miner_hash_rate_GHps{wallet_address="${wallet}"}) by (wallet_address)`;
    recentUrl.searchParams.append('query', recentQuery);
    recentUrl.searchParams.append('start', recentStartTime.toString());
    recentUrl.searchParams.append('end', endTime.toString());
    recentUrl.searchParams.append('step', (recentStepMinutes * 60).toString());

    // Fetch historical data with coarser granularity
    const historicalUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    historicalUrl.searchParams.append('query', recentQuery);
    historicalUrl.searchParams.append('start', startTime.toString());
    historicalUrl.searchParams.append('end', recentStartTime.toString());
    historicalUrl.searchParams.append('step', (historicalStepHours * 3600).toString());

    const [recentResponse, historicalResponse] = await Promise.all([
      fetch(recentUrl),
      fetch(historicalUrl)
    ]);

    if (!recentResponse.ok || !historicalResponse.ok) {
      console.error('Pool API error:', {
        recentStatus: recentResponse.status,
        historicalStatus: historicalResponse.status,
        recentUrl: recentUrl.toString(),
        historicalUrl: historicalUrl.toString()
      });
      throw new Error(`HTTP error! status: ${recentResponse.status} / ${historicalResponse.status}`);
    }

    const [recentData, historicalData] = await Promise.all([
      recentResponse.json(),
      historicalResponse.json()
    ]);

    // Merge the datasets
    if (recentData.status === 'success' && historicalData.status === 'success') {
      const mergedResult = recentData.data.result.map((series: any) => {
        const historicalSeries = historicalData.data.result.find(
          (h: any) => h.metric.wallet_address === series.metric.wallet_address
        );
        
        if (historicalSeries) {
          return {
            ...series,
            values: [...historicalSeries.values, ...series.values]
          };
        }
        return series;
      });

      return NextResponse.json({
        status: 'success',
        data: {
          resultType: recentData.data.resultType,
          result: mergedResult
        }
      });
    }

    return NextResponse.json({
      status: 'error',
      error: 'Failed to fetch complete hashrate data'
    });
  } catch (error: unknown) {
    console.error('Error in miner hashrate API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner hashrate' },
      { status: 500 }
    );
  }
} 