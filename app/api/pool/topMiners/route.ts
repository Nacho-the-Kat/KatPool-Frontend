import { NextResponse } from 'next/server';

export const runtime = 'edge';
// In-memory cache object
const cacheStore: { [key: string]: { data: any; expires: number } } = {};
const CACHE_TTL = 60 * 1000 * 10 - 10000; // 9 minute 50 sec in milliseconds

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

export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    const cached = cacheStore['topMiners'];
    if (cached && cached.expires > now) {
      return NextResponse.json({
        status: 'success',
        data: cached.data
      });
    }

    // Calculate time range for the last 48 hours
    const end = Math.floor(Date.now() / 1000);
    const start = end - (48 * 60 * 60);
    const step = 300;

    // Prepare URLs for parallel requests
    const hashrateUrl = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    hashrateUrl.searchParams.append('query', 'sum(miner_hash_rate_GHps) by (wallet_address)');
    hashrateUrl.searchParams.append('start', start.toString());
    hashrateUrl.searchParams.append('end', end.toString());
    hashrateUrl.searchParams.append('step', step.toString());

    // Make initial requests in parallel
    const [hashrateResponse, kasResponse] = await Promise.all([
      fetch(hashrateUrl),
      fetch('http://kas.katpool.xyz:8080/api/pool/48hKASpayouts')
    ]);

    if (!hashrateResponse.ok) {
      throw new Error(`HTTP error! Hashrate status: ${hashrateResponse.status}`);
    }
    if (!kasResponse.ok) {
      throw new Error(`HTTP error! KAS status: ${kasResponse.status}`);
    }

    const hashrateData = await hashrateResponse.json();
    const kasData = await kasResponse.json();

    if (hashrateData.status !== 'success' || !hashrateData.data?.result) {
      throw new Error('Invalid hashrate response format');
    }

    // Get list of active wallets
    const activeWallets = hashrateData.data.result.map((miner: any) => miner.metric.wallet_address);

    // NACHO payments grouped by wallet for last 48 hours
    const rebatesMap = await fetch('http://kas.katpool.xyz:8080/api/pool/48hNACHOPayouts').then(res => res.json());
    // Also need to restore KAS rewards processing
    const rewardsMap = new Map<string, number>();

    // Process KAS rewards (no need to filter by 48h, endpoint already does it)
    kasData.forEach((payout: KasPayment) => {
      const wallet = payout.wallet_address[0];
      const amount = Number(BigInt(payout.amount)) / 1e8;
      rewardsMap.set(wallet, (rewardsMap.get(wallet) || 0) + amount);
    });

    // Calculate pool total hashrate and process miner data
    let poolTotalHashrate = 0;
    const minerData: MinerData[] = [];

    // Process each miner's data
    hashrateData.data.result.forEach((miner: any) => {
      const values = miner.values;
      if (!values || values.length === 0) return;

      const validValues = values
        .map(([timestamp, value]: [number, string]) => Number(value))
        .filter((value: number) => !isNaN(value) && value > 0);

      if (validValues.length === 0) return;

      const sortedValues = [...validValues].sort((a, b) => a - b);
      const trimAmount = Math.floor(sortedValues.length * 0.1);
      const trimmedValues = sortedValues.slice(trimAmount, -trimAmount);

      const averageHashrate = trimmedValues.reduce((sum, value) => sum + value, 0) / trimmedValues.length;

      if (averageHashrate > 0) {
        minerData.push({
          wallet: miner.metric.wallet_address,
          hashrate: averageHashrate,
          poolShare: 0,
          rank: 0,
          rewards48h: rewardsMap.get(miner.metric.wallet_address) || 0,
          nachoRebates48h: rebatesMap[miner.metric.wallet_address] || 0
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

    // Cache the processed data
    cacheStore['topMiners'] = {
      data: minerData,
      expires: Date.now() + CACHE_TTL
    };

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