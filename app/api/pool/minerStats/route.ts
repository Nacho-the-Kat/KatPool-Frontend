import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Initialize cache with 1 minute TTL
const cache = new NodeCache({ stdTTL: 60 });

interface MinerData {
  metric: {
    wallet_address: string;
    miner_id: string;
    [key: string]: string;
  };
  values: [number, string][];
}

interface ProcessedStats {
  [wallet: string]: {
    totalShares: number;
    firstSeen: number;
    activeWorkers: number;
    minerIds: Set<string>;
  };
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    // Check cache first
    const cachedData = cache.get('minerStats');
    if (cachedData) {
      return NextResponse.json({
        status: 'success',
        data: cachedData
      });
    }

    const end = Math.floor(Date.now() / 1000);
    const start = 1735689600; // Jan 1 2025 at 12am midnight UTC
    const step = 24 * 60 * 60; // 24 hours in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', 'added_miner_shares_1min_count');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Encoding': 'gzip',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.data?.result) {
      const stats = data.data.result.reduce((acc: ProcessedStats, result: MinerData) => {
        const wallet = result.metric.wallet_address;
        const minerId = result.metric.miner_id;
        
        if (!acc[wallet]) {
          acc[wallet] = {
            totalShares: 0,
            firstSeen: Infinity,
            activeWorkers: 0,
            minerIds: new Set<string>()
          };
        }

        if (result.values.length > 0) {
          const lastValue = Number(result.values[result.values.length - 1][1]);
          if (lastValue > 0) {
            acc[wallet].totalShares += lastValue;
            acc[wallet].minerIds.add(minerId);
            acc[wallet].firstSeen = Math.min(
              acc[wallet].firstSeen, 
              result.values[0][0]
            );
          }
        }

        return acc;
      }, {});

      // Single pass to format final output
      const formattedStats = Object.fromEntries(
        (Object.entries(stats) as Array<[string, ProcessedStats[string]]>).map(([wallet, stat]) => [
          wallet,
          {
            totalShares: stat.totalShares,
            firstSeen: stat.firstSeen,
            activeWorkers: stat.minerIds.size
          }
        ])
      );

      // Cache the processed data
      cache.set('minerStats', formattedStats);

      return NextResponse.json({
        status: 'success',
        data: formattedStats
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in miner stats API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner stats' },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
} 