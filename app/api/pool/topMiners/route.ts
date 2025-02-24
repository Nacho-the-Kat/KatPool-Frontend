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
  rewards24h: number;
  nachoRebates: number;
}

export async function GET() {
  try {
    // Calculate time range for the last 24 hours
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours ago
    const step = 300; // 5-minute intervals

    // Fetch hashrate data for all miners
    const hashrateUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    hashrateUrl.searchParams.append('query', 'sum(miner_hash_rate_GHps) by (wallet_address)');
    hashrateUrl.searchParams.append('start', start.toString());
    hashrateUrl.searchParams.append('end', end.toString());
    hashrateUrl.searchParams.append('step', step.toString());

    // Fetch hashrate data and both payment types
    const [hashrateResponse, kasPayoutsResponse, nachoPayoutsResponse] = await Promise.all([
      fetch(hashrateUrl),
      fetch('http://kas.katpool.xyz:8080/api/pool/payouts'),
      fetch('http://kas.katpool.xyz:8080/api/pool/nacho_payouts')
    ]);

    if (!hashrateResponse.ok || !kasPayoutsResponse.ok || !nachoPayoutsResponse.ok) {
      throw new Error(`HTTP error! status: ${hashrateResponse.status}/${kasPayoutsResponse.status}/${nachoPayoutsResponse.status}`);
    }

    const [hashrateData, kasPayouts, nachoPayouts] = await Promise.all([
      hashrateResponse.json(),
      kasPayoutsResponse.json(),
      nachoPayoutsResponse.json()
    ]);

    if (hashrateData.status !== 'success' || !hashrateData.data?.result) {
      throw new Error('Invalid hashrate response format');
    }

    // Process KAS rewards for last 24h
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const rewardsMap = new Map<string, number>();
    const rebatesMap = new Map<string, number>();

    // Process KAS payouts
    kasPayouts.forEach((payout: KasPayment) => {
      const timestamp = new Date(payout.timestamp).getTime();
      if (timestamp >= twentyFourHoursAgo) {
        const wallet = payout.wallet_address[0];
        const amount = Number(payout.amount) / 1e8;
        rewardsMap.set(wallet, (rewardsMap.get(wallet) || 0) + amount);
      }
    });

    // Process NACHO payouts
    nachoPayouts.forEach((payout: NachoPayment) => {
      const timestamp = new Date(payout.timestamp).getTime();
      if (timestamp >= twentyFourHoursAgo) {
        const wallet = payout.wallet_address[0];
        const amount = Number(payout.nacho_amount) / 1e8;
        rebatesMap.set(wallet, (rebatesMap.get(wallet) || 0) + amount);
      }
    });

    // Calculate pool total hashrate and process miner data
    let poolTotalHashrate = 0;
    const minerData: MinerData[] = [];

    // Process each miner's data
    hashrateData.data.result.forEach((miner: any) => {
      const values = miner.values;
      if (!values || values.length === 0) return;

      // Calculate 24h average hashrate using the sophisticated averaging method
      const validValues = values
        .map(([timestamp, value]: [number, string]) => Number(value))
        .filter((value: number) => !isNaN(value) && value > 0);

      if (validValues.length === 0) return;

      // Sort values and remove outliers (top and bottom 10%)
      const sortedValues = [...validValues].sort((a, b) => a - b);
      const trimAmount = Math.floor(sortedValues.length * 0.1);
      const trimmedValues = sortedValues.slice(trimAmount, -trimAmount);

      // Calculate average of remaining values
      const averageHashrate = trimmedValues.reduce((sum, value) => sum + value, 0) / trimmedValues.length;

      if (averageHashrate > 0) {
        minerData.push({
          wallet: miner.metric.wallet_address,
          hashrate: averageHashrate,
          poolShare: 0,
          rank: 0,
          rewards24h: rewardsMap.get(miner.metric.wallet_address) || 0,
          nachoRebates: rebatesMap.get(miner.metric.wallet_address) || 0
        });
        poolTotalHashrate += averageHashrate;
      }
    });

    // Calculate pool shares and sort by hashrate
    minerData.forEach(miner => {
      miner.poolShare = (miner.hashrate / poolTotalHashrate) * 100;
    });

    // Sort by hashrate descending and assign ranks
    minerData.sort((a, b) => b.hashrate - a.hashrate);
    minerData.forEach((miner, index) => {
      miner.rank = index + 1;
    });

    return NextResponse.json({
      status: 'success',
      data: minerData
    });
  } catch (error) {
    console.error('Error fetching top miners:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch top miners' },
      { status: 500 }
    );
  }
} 