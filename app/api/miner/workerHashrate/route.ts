import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface WorkerHashrate {
  metric: {
    __name__: string;
    wallet_address: string;
    miner_id: string;
    [key: string]: string;
  };
  values: [number, string][];
}

interface TimeWindow {
  duration: number;
  step: number;
}

const timeWindows: Record<string, TimeWindow> = {
  '5min': {
    duration: 15 * 60,
    step: 20    // 20-sec intervals for 5 min (15 points)
  },
  '15min': {
    duration: 15 * 60,
    step: 60    // 1-minute intervals for 15 min (15 points)
  },
  '1h': {
    duration: 60 * 60,
    step: 300   // 5-minute intervals for 1 hour (12 points)
  },
  '12h': {
    duration: 12 * 60 * 60,
    step: 900   // 15-minute intervals for 12 hours (48 points)
  },
  '24h': {
    duration: 24 * 60 * 60,
    step: 1800  // 30-minute intervals for 24 hours (48 points)
  },
  '48h': {
    duration: 24 * 60 * 60,
    step: 3600  // 1-hour intervals for 48 hours (48 points)
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    // Create API calls for each time window
    const fetchPromises = Object.entries(timeWindows).map(([key, window]) => {
      const end = now;
      const start = end - window.duration;
      const url = new URL(`http://kas.katpool.xyz:8080/api/v1/query_range?query=worker_hash_rate_GHps{wallet_address="${wallet}"}&start=${start}&end=${end}&step=${window.step}`);
      return fetch(url).then(res => res.json()).then(data => ({ key, data }));
    });

    // Fetch all data in parallel
    const responses = await Promise.all(fetchPromises);

    // Process the results
    const workerData = new Map<string, any>();

    // Filter out values where the metric is 0 - indicates no activity from the worker at that timestamp
    responses.forEach((response) => {
      response.data.data.result.forEach((metricEntry: { values: [number, string][] }) => {
        metricEntry.values = metricEntry.values.filter(
          ([_time, value]: [number, string]) => value !== '0'
        );
      });
    });

    responses.forEach(({ key, data }) => {
      if (data.status !== 'success') return;

      data.data.result.forEach((worker: WorkerHashrate) => {
        const minerId = worker.metric.miner_id;
        if (!workerData.has(minerId)) {
          workerData.set(minerId, {
            metric: worker.metric,
            averages: {
              fiveMin: 0,
              fifteenMin: 0,
              oneHour: 0,
              twelveHour: 0,
              twentyFourHour: 0,
              fortyEightHour: 0
            }
          });
        }

        const values = worker.values;
        if (!values || values.length === 0) return;

        // Calculate average for this time window
        const sum = values.reduce((acc, [_, val]) => acc + Number(val), 0);
        const avg = sum / values.length;

        // Map the key to the correct average field
        const averageField = key === '5min' ? 'fiveMin' :
                           key === '15min' ? 'fifteenMin' :
                           key === '1h' ? 'oneHour' :
                           key === '12h' ? 'twelveHour' :
                           key === '24h' ? 'twentyFourHour' :
                           'fortyEightHour';

        workerData.get(minerId).averages[averageField] = avg;
      });
    });

    // Convert Map to array for response
    const processedResult = Array.from(workerData.values());

    return NextResponse.json({
      status: 'success',
      data: {
        result: processedResult
      }
    });
  } catch (error) {
    console.error('Error fetching worker hashrate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch worker hashrate' },
      { status: 500 }
    );
  }
} 