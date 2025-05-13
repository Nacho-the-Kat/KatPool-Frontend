import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';

export const runtime = 'edge';
// Initialize cache with 9 minutes 50 seconds TTL
// Top miner send request every 10 minutes
const cache = new NodeCache({ stdTTL: 590 });

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
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Check cache first
    const cachedData = cache.get('topMiners');
    if (cachedData) {
      const paginatedData = {
        miners: (cachedData as any[]).slice(skip, skip + pageSize),
        total: (cachedData as any[]).length,
        page,
        pageSize,
        totalPages: Math.ceil((cachedData as any[]).length / pageSize)
      };
      return NextResponse.json({
        status: 'success',
        data: paginatedData
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
      fetch('http://kas.katpool.xyz:8080/api/pool/payouts')
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

    // Process NACHO payments in batches
    const BATCH_SIZE = 10;
    const rebatesMap = new Map<string, number>();
    const fortyEightHoursAgo = Date.now() - (48 * 60 * 60 * 1000);

    // Process all wallets in batches of 10
    for (let i = 0; i < activeWallets.length; i += BATCH_SIZE) {
      const batch = activeWallets.slice(i, i + BATCH_SIZE);
      const batchResponses = await Promise.all(
        batch.map((wallet: string) => 
          fetch(`http://kas.katpool.xyz:8080/api/nacho_payments/${wallet}`)
            .then(async res => {
              if (!res.ok) {
                console.error(`Failed to fetch NACHO data for wallet ${wallet}: ${res.status}`);
                return null;
              }
              return { wallet, data: await res.json() };
            })
            .catch(error => {
              console.error(`Error fetching NACHO data for wallet ${wallet}:`, error);
              return null;
            })
        )
      );

      // Process batch results
      batchResponses.forEach(response => {
        if (!response) return;
        const { wallet, data } = response;
        
        let total48h = 0;
        data.forEach((payout: NachoPayment) => {
          const timestamp = new Date(payout.timestamp).getTime();
          if (timestamp >= fortyEightHoursAgo) {
            total48h += Number(BigInt(payout.nacho_amount)) / 1e8;
          }
        });

        if (total48h > 0) {
          rebatesMap.set(wallet, total48h);
        }
      });

      // Add a small delay between batches
      // TODO: not sure if this is needed
      // await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Debug log final rebates map
    console.log('Final rebates map:', Object.fromEntries(rebatesMap));

    // Also need to restore KAS rewards processing
    const rewardsMap = new Map<string, number>();

    // Process KAS rewards
    kasData.forEach((payout: KasPayment) => {
      const timestamp = new Date(payout.timestamp).getTime();
      if (timestamp >= fortyEightHoursAgo) {
        const wallet = payout.wallet_address[0];
        const amount = Number(BigInt(payout.amount)) / 1e8;
        rewardsMap.set(wallet, (rewardsMap.get(wallet) || 0) + amount);
      }
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
          nachoRebates48h: rebatesMap.get(miner.metric.wallet_address) || 0
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
    cache.set('topMiners', minerData);

    // Return paginated data
    const paginatedData = {
      miners: minerData.slice(skip, skip + pageSize),
      total: minerData.length,
      page,
      pageSize,
      totalPages: Math.ceil(minerData.length / pageSize)
    };

    return NextResponse.json({
      status: 'success',
      data: paginatedData
    });
  } catch (error) {
    console.error('Error fetching top miners:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch top miners' },
      { status: 500 }
    );
  }
} 