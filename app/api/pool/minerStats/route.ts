import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

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
  try {
    const end = Math.floor(Date.now() / 1000);
    const start = 1735689600; // Jan 1 2025 at 12am midnight UTC
    const step = 24 * 60 * 60; // 24 hours in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    url.searchParams.append('query', 'added_miner_shares_1min_count');
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && data.data?.result) {
      const stats: ProcessedStats = {};

      // First pass: Initialize data structures and collect miner IDs
      data.data.result.forEach((result: MinerData) => {
        const wallet = result.metric.wallet_address;
        const minerId = result.metric.miner_id;
        
        if (!stats[wallet]) {
          stats[wallet] = {
            totalShares: 0,
            firstSeen: Infinity,
            activeWorkers: 0,
            minerIds: new Set<string>()
          };
        }

        // Get the last values entry for total shares (cumulative total)
        if (result.values.length > 0) {
          const lastValue = Number(result.values[result.values.length - 1][1]);
          stats[wallet].totalShares += lastValue;

          // If the miner has any shares, count them as active
          if (lastValue > 0) {
            stats[wallet].minerIds.add(minerId);
          }
        }

        // Get the first values entry for first seen (oldest timestamp)
        if (result.values.length > 0) {
          const firstTimestamp = result.values[0][0];
          stats[wallet].firstSeen = Math.min(stats[wallet].firstSeen, firstTimestamp);
        }
      });

      // Second pass: Calculate active workers and clean up
      const processedStats = Object.entries(stats).reduce((acc, [wallet, stat]) => {
        acc[wallet] = {
          totalShares: stat.totalShares,
          firstSeen: stat.firstSeen,
          activeWorkers: stat.minerIds.size
        };
        return acc;
      }, {} as { [wallet: string]: Omit<ProcessedStats[string], 'minerIds'> });

      return NextResponse.json({
        status: 'success',
        data: processedStats
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in miner stats API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner stats' },
      { status: 500 }
    );
  }
} 