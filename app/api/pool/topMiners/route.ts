import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes

interface KasPayment {
  wallet_address: string[];
  amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface NachoPayment {
  wallet_address: string[];
  nacho_amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface MinerData {
  wallet: string;
  hashrate: number;
  poolShare: number;
  rank: number;
  rewards48h: number;
  nachoRebates48h: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const start = (page - 1) * limit;

    // Calculate time range for the last 48 hours
    const end = Math.floor(Date.now() / 1000);
    const timeStart = end - (48 * 60 * 60);
    const step = 900; // Increase step to 15 minutes to reduce data points

    // Fetch hashrate data for all miners with optimized query
    const hashrateUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    hashrateUrl.searchParams.append('query', 'sum(miner_hash_rate_GHps) by (wallet_address) > 0'); // Only get active miners
    hashrateUrl.searchParams.append('start', timeStart.toString());
    hashrateUrl.searchParams.append('end', end.toString());
    hashrateUrl.searchParams.append('step', step.toString());

    // Parallel fetch for both hashrate and KAS payouts
    const [hashrateResponse, kasResponse] = await Promise.all([
      fetch(hashrateUrl),
      fetch('http://kas.katpool.xyz:8080/api/pool/payouts')
    ]);

    if (!hashrateResponse.ok || !kasResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const [hashrateData, kasData] = await Promise.all([
      hashrateResponse.json(),
      kasResponse.json()
    ]);

    if (hashrateData.status !== 'success' || !hashrateData.data?.result) {
      throw new Error('Invalid hashrate response format');
    }

    // Process hashrates first
    let poolTotalHashrate = 0;
    const minerMap = new Map<string, MinerData>();
    const fortyEightHoursAgo = Date.now() - (48 * 60 * 60 * 1000);

    // Process hashrate data
    hashrateData.data.result.forEach((miner: any) => {
      const values = miner.values;
      if (!values?.length) return;

      const validValues = values
        .map(([_, value]: [number, string]) => Number(value))
        .filter((value: number) => !isNaN(value) && value > 0);

      if (!validValues.length) return;

      // Use median instead of trimmed mean for more stability
      const sortedValues = [...validValues].sort((a, b) => a - b);
      const medianHashrate = sortedValues[Math.floor(sortedValues.length / 2)];

      if (medianHashrate > 0) {
        minerMap.set(miner.metric.wallet_address, {
          wallet: miner.metric.wallet_address,
          hashrate: medianHashrate,
          poolShare: 0,
          rank: 0,
          rewards48h: 0,
          nachoRebates48h: 0
        });
        poolTotalHashrate += medianHashrate;
      }
    });

    // Process KAS rewards
    kasData.forEach((payout: KasPayment) => {
      const timestamp = new Date(payout.timestamp).getTime();
      if (timestamp >= fortyEightHoursAgo) {
        const wallet = payout.wallet_address[0];
        if (minerMap.has(wallet)) {
          const amount = Number(BigInt(payout.amount)) / 1e8;
          const miner = minerMap.get(wallet)!;
          miner.rewards48h += amount;
        }
      }
    });

    // Convert to array and calculate pool shares
    const minerData = Array.from(minerMap.values());
    minerData.forEach(miner => {
      miner.poolShare = (miner.hashrate / poolTotalHashrate) * 100;
    });

    // Sort by hashrate and assign ranks
    minerData.sort((a, b) => b.hashrate - a.hashrate);
    minerData.forEach((miner, index) => {
      miner.rank = index + 1;
    });

    // Apply pagination
    const paginatedData = minerData.slice(start, start + limit);
    const total = minerData.length;

    return NextResponse.json({
      status: 'success',
      data: paginatedData,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching top miners:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch top miners' },
      { status: 500 }
    );
  }
} 