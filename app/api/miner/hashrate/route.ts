import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

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

function filterOutAnomalies(
  historicalData: {
    metric: { wallet_address: string };
    values: [number, string][];
  }[]
) {
  return historicalData.map(({ metric, values }) => {
    const cleanedValues: [number, string][] = [];

    for (let i = 0; i < values.length; i++) {
      const surrounding: number[] = [];

      // Collect 4 values before and 4 values after (excluding the current value)
      for (let j = i - 4; j <= i + 4; j++) {
        if (j === i || j < 0 || j >= values.length) continue;
        surrounding.push(parseFloat(values[j][1]));
      }

      // If not enough data points, keep the value
      if (surrounding.length < 8) {
        cleanedValues.push(values[i]);
        continue;
      }

      const surroundingAvg =
        surrounding.reduce((sum, val) => sum + val, 0) / surrounding.length;

      const currentVal = parseFloat(values[i][1]);

      // Keep only non-spikes
      if (currentVal <= surroundingAvg * 2.5) {
        cleanedValues.push(values[i]);
      }
    }

    return { metric, values: cleanedValues };
  });
}

// TODO: remove this after fix on backend side
function removeConsecutiveDuplicates(data: {
  metric: { wallet_address: string };
  values: [number, string][];
}[]) {
  const clonedData = JSON.parse(JSON.stringify(data));

  clonedData.data.result.forEach((entry: { values: string | any[]; }) => {
    let prevValue: string | null = null;

    for (let i = 0; i < entry.values.length; i++) {
      const currentValue = entry.values[i][1];
      if (currentValue === prevValue) {
        entry.values[i][1] = '0';
      } else {
        prevValue = currentValue;
      }
    }
  });

  return clonedData;
}


export async function GET(request: Request) {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

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

    const baseUrl = process.env.METRICS_BASE_URL || 'http://kas.katpool.xyz:8080';

    const { days, recentStepMinutes, historicalStepHours } = TIME_RANGES[range];
    const endTime = Math.floor(Date.now() / 1000);
    const recentStartTime = endTime - (2 * 60 * 60); // Last 2 hours
    const startTime = endTime - (days * 24 * 60 * 60);

    const recentQuery = `sum(miner_hash_rate_GHps{wallet_address="${wallet}"}) by (wallet_address)`;
    // Fetch recent data (5-minute intervals)
    // const recentUrl = new URL(`${baseUrl}/api/v1/query_range`);
    // recentUrl.searchParams.append('query', recentQuery);
    // recentUrl.searchParams.append('start', recentStartTime.toString());
    // recentUrl.searchParams.append('end', endTime.toString());
    // recentUrl.searchParams.append('step', (recentStepMinutes * 60).toString());

    // Fetch historical data with coarser granularity
    const historicalUrl = new URL(`${baseUrl}/api/v1/query_range`);
    historicalUrl.searchParams.append('query', recentQuery);
    historicalUrl.searchParams.append('start', startTime.toString());
    historicalUrl.searchParams.append('end', recentStartTime.toString());
    historicalUrl.searchParams.append('step', (historicalStepHours * 3600).toString());

    const [/*recentResponse,*/ historicalResponse] = await Promise.all([
      // fetch(recentUrl, {
      //   headers: {
      //     'x-trace-id': traceId || '',
      //   },
      // }),
      fetch(historicalUrl, {
        headers: {
          'x-trace-id': traceId || '',
        },
      })
    ]);

    if (!historicalResponse.ok) {
      logger.error('Pool API error:', {
        // recentStatus: recentResponse.status,
        historicalStatus: historicalResponse.status,
        // recentUrl: recentUrl.toString(),
        historicalUrl: historicalUrl.toString(),
        traceId
      });
      throw new Error(`HTTP error! status: ${historicalResponse.status}`);
    }

    // const [recentData, historicalData] = await Promise.all([
    //   recentResponse.json(),
    //   historicalResponse.json()
    // ]);
    const historicalData = await historicalResponse.json();

    // TODO: get rid of removeConsecutiveDuplicates after fix on backend side
    const historicalDataWithoutConsecutiveDuplicates = await removeConsecutiveDuplicates(historicalData);
    const filteredHistoricalData = await filterOutAnomalies(historicalDataWithoutConsecutiveDuplicates.data.result);

    // Merge the datasets
    // if (recentDataWithoutConsecutiveDuplicates.status === 'success' && historicalData.status === 'success') {
    //   const mergedResult = recentDataWithoutConsecutiveDuplicates.data.result.map((series: any) => {
    //     const historicalSeries = filteredHistoricalData.find(
    //       (h: any) => h.metric.wallet_address === series.metric.wallet_address
    //     );

    //     if (historicalSeries) {
    //       return {
    //         ...series,
    //         values: [...historicalSeries.values, ...series.values]
    //       };
    //     }
    //     return series;
    //   });

    //   return NextResponse.json({
    //     status: 'success',
    //     data: {
    //       resultType: recentData.data.resultType,
    //       result: mergedResult
    //     }
    //   });
    // }

    return NextResponse.json({
      status: 'success',
      data: {
        resultType: filteredHistoricalData,
        result: filteredHistoricalData
      }
    });
  } catch (error: unknown) {
    logger.error('Error in miner hashrate API:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner hashrate' },
      { status: 500 }
    );
  }
} 