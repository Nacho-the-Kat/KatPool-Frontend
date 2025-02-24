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

interface ProcessedPayment {
  walletAddress: string;
  kasAmount?: string;
  nachoAmount?: string;
  timestamp: number;
  transactionHash: string;
  type: 'kas' | 'nacho';
}

interface MinerData {
  wallet: string;
  hashrate: number;
  poolShare: number;
  rank: number;
  rewards24h: number;
  nachoRebates: number;
  firstSeen: number;
}

interface MinerStats {
  firstSeen: number;
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
    const [hashrateResponse, kasResponse, nachoResponse, statsResponse] = await Promise.all([
      fetch(hashrateUrl),
      fetch('http://kas.katpool.xyz:8080/api/pool/payouts'),
      fetch('http://kas.katpool.xyz:8080/api/pool/nacho_payouts'),
      fetch('http://kas.katpool.xyz:8080/api/pool/minerStats')
    ]);

    if (!hashrateResponse.ok || !kasResponse.ok || !nachoResponse.ok || !statsResponse.ok) {
      throw new Error(`HTTP error! status: ${hashrateResponse.status}/${kasResponse.status}/${nachoResponse.status}/${statsResponse.status}`);
    }

    const [hashrateData, kasData, nachoData, statsData] = await Promise.all([
      hashrateResponse.json(),
      kasResponse.json(),
      nachoResponse.json(),
      statsResponse.json()
    ]);

    if (hashrateData.status !== 'success' || !hashrateData.data?.result) {
      throw new Error('Invalid hashrate response format');
    }

    // Create a map for first seen timestamps
    const firstSeenMap = new Map<string, number>();
    if (statsData.status === 'success' && statsData.data) {
      Object.entries(statsData.data).forEach(([wallet, stats]: [string, any]) => {
        if (stats && typeof stats.firstSeen === 'number') {
          firstSeenMap.set(wallet, stats.firstSeen);
        }
      });
    }

    // Process KAS payments
    const processedKasPayments: ProcessedPayment[] = kasData.map((payout: KasPayment) => ({
      walletAddress: payout.wallet_address[0],
      kasAmount: (Number(BigInt(payout.amount)) / 1e8).toFixed(8),
      timestamp: new Date(payout.timestamp).getTime(),
      transactionHash: payout.transaction_hash,
      type: 'kas'
    }));

    // Process NACHO payments
    const processedNachoPayments: ProcessedPayment[] = nachoData.map((payout: NachoPayment) => ({
      walletAddress: payout.wallet_address[0],
      nachoAmount: (Number(BigInt(payout.nacho_amount)) / 1e8).toFixed(8),
      timestamp: new Date(payout.timestamp).getTime(),
      transactionHash: payout.transaction_hash,
      type: 'nacho'
    }));

    // Combine all payments
    const allPayments = [...processedKasPayments, ...processedNachoPayments];

    // Calculate 24h totals for each wallet
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const rewardsMap = new Map<string, number>();
    const rebatesMap = new Map<string, number>();

    allPayments.forEach(payment => {
      if (payment.timestamp >= twentyFourHoursAgo) {
        const wallet = payment.walletAddress;
        if (payment.type === 'kas' && payment.kasAmount) {
          rewardsMap.set(wallet, (rewardsMap.get(wallet) || 0) + Number(payment.kasAmount));
        }
        if (payment.type === 'nacho' && payment.nachoAmount) {
          rebatesMap.set(wallet, (rebatesMap.get(wallet) || 0) + Number(payment.nachoAmount));
        }
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
        const firstSeenTimestamp = firstSeenMap.get(miner.metric.wallet_address);
        minerData.push({
          wallet: miner.metric.wallet_address,
          hashrate: averageHashrate,
          poolShare: 0,
          rank: 0,
          rewards24h: rewardsMap.get(miner.metric.wallet_address) || 0,
          nachoRebates: rebatesMap.get(miner.metric.wallet_address) || 0,
          firstSeen: firstSeenTimestamp 
            ? Math.floor((Date.now() / 1000 - firstSeenTimestamp) / (24 * 60 * 60))
            : 0
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