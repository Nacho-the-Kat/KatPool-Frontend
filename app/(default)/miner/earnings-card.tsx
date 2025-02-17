'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'

interface Payment {
  id: number;
  walletAddress: string;
  amount: number;
  timestamp: number;
  transactionHash: string;
}

interface EstimateRange {
  low: bigint;
  expected: bigint;
  high: bigint;
}

// Add interfaces for hashrate data
interface HashratePoint {
  value: number;
  timestamp: number;
}

// Add interface for difficulty data
interface DifficultyPoint {
  timestamp: number;
  value: number;
}

export default function AnalyticsCard04() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dailyKas, setDailyKas] = useState<bigint | null>(null)
  const [kasPrice, setKasPrice] = useState<number | null>(null)
  const [nachoPrice, setNachoPrice] = useState<number | null>(null)
  const [hasPayments, setHasPayments] = useState<boolean>(false)
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [averagePayment, setAveragePayment] = useState<bigint | null>(null)
  const [networkDifficulty, setNetworkDifficulty] = useState<number | null>(null)
  const [minerHashrate, setMinerHashrate] = useState<number | null>(null)
  const [isQualified, setIsQualified] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const [paymentsRes, kasPriceRes, nachoPriceRes, hashrateRes, nachoBalanceRes, nachoNFTsRes] = await Promise.all([
          $fetch(`/api/miner/payments?wallet=${walletAddress}`),
          $fetch('/api/pool/price'),
          $fetch('/api/pool/nachoPrice'),
          $fetch(`/api/miner/currentHashrate?wallet=${walletAddress}`),
          $fetch(`/api/pool/nachoBalance?wallet=${walletAddress}`),
          $fetch(`/api/pool/nachoNFTs?wallet=${walletAddress}`)
        ]);

        // Check qualification status
        const isQualifiedByTokens = nachoBalanceRes.status === 'success' && nachoBalanceRes.data.qualified;
        const isQualifiedByNFTs = nachoNFTsRes.status === 'success' && nachoNFTsRes.data.qualified;
        setIsQualified(isQualifiedByTokens || isQualifiedByNFTs);

        if (paymentsRes.status === 'success') {
          setHasPayments(paymentsRes.data.length > 0);
          if (paymentsRes.data.length > 0) {
            setRecentPayments(paymentsRes.data);
            
            const dailyEstimate = calculateDailyEstimate(paymentsRes.data);
            setDailyKas(dailyEstimate);
          } else {
            setDailyKas(null);
          }
        }

        if (kasPriceRes.status === 'success') {
          setKasPrice(kasPriceRes.data.price);
        }

        if (nachoPriceRes.status === 'success') {
          setNachoPrice(nachoPriceRes.data.price);
        }

        if (hashrateRes.status === 'success') {
          setNetworkDifficulty(hashrateRes.data.networkDifficulty);
          setMinerHashrate(hashrateRes.data.minerHashrate);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setIsQualified(false);
        setDailyKas(null);
        setKasPrice(null);
        setNachoPrice(null);
        setHasPayments(false);
        setNetworkDifficulty(null);
        setMinerHashrate(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  const formatKas = (amount: bigint | null) => {
    if (amount === null) return '--';
    // Convert from sompi to KAS with proper decimal places
    const kasString = amount.toString().padStart(9, '0');
    const integerPart = kasString.slice(0, -8) || '0';
    const decimalPart = kasString.slice(-8);
    const formattedInteger = parseInt(integerPart).toLocaleString('en-US');
    return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
  };

  const calculateAmount = (baseAmount: bigint | null, multiplier: number) => {
    if (baseAmount === null) return null;
    // For division (like hourly), we multiply first to maintain precision
    if (multiplier < 1) {
      const divisor = Math.round(1 / multiplier);
      return baseAmount / BigInt(divisor);
    }
    // For multiplication (like weekly, monthly, yearly)
    return baseAmount * BigInt(Math.round(multiplier));
  };

  const calculateNachoRebate = (kasAmount: bigint | null) => {
    if (kasAmount === null || kasPrice === null || nachoPrice === null) return null;

    // Convert the sompi amount to KAS
    const kasValue = Number(kasAmount) / 100000000;

    // Calculate USD value of the KAS
    const kasUSDValue = kasValue * kasPrice;

    // Calculate the total fee amount in USD
    const feeAmount = kasUSDValue / 0.9925;

    // Calculate NACHO rebate based on qualification
    const rebateFactor = isQualified ? 1 : 1/3;
    const nachoRebate = (feeAmount * rebateFactor) / nachoPrice;

    return nachoRebate;
  };

  const calculateUSDValue = (kasAmount: bigint | null, nachoRebate: number | null) => {
    if (kasAmount === null || kasPrice === null || nachoRebate === null || nachoPrice === null) return null;

    // First convert the sompi amount to KAS
    const kasValue = Number(kasAmount) / 100000000;

    // Calculate USD value of the KAS
    const kasUSDValue = kasValue * kasPrice;

    // Calculate USD value of the NACHO rebate
    const nachoUSDValue = nachoRebate * nachoPrice;

    // Return total USD value
    return kasUSDValue + nachoUSDValue;
  };

  const formatNacho = (amount: number | null) => {
    if (amount === null) return '--';
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatUSD = (amount: number | null) => {
    if (amount === null) return '--';
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateDailyEstimate = (payments: Payment[]): bigint => {
    if (payments.length === 0) return BigInt(0);
    
    let weightedSum = BigInt(0);
    let weightSum = 0;
    
    // Use up to last 5 payments with exponential decay
    const recentPayouts = payments.slice(0, 5);
    recentPayouts.forEach((payment, index) => {
      const weight = Math.exp(-0.5 * index); // Exponential decay factor
      weightedSum += BigInt(Math.round(Number(payment.amount) * weight));
      weightSum += weight;
    });
    
    const weightedAvg = weightedSum / BigInt(Math.round(weightSum * 1e8)) * BigInt(1e8);
    return weightedAvg * BigInt(2); // Double for daily estimate
  };

  const renderRow = (label: string, amount: bigint | null) => {
    const nachoRebate = calculateNachoRebate(amount);
    const usdValue = calculateUSDValue(amount, nachoRebate);
    
    return (
      <tr>
        <td className="p-2">
          <div className="text-gray-800 dark:text-gray-100">{label}</div>
        </td>
        <td className="p-2 text-center">{formatKas(amount)}</td>
        <td className="p-2 text-center">{formatNacho(nachoRebate)}</td>
        <td className="p-2 text-center">
          <div className={`${usdValue && usdValue > 0 ? 'text-green-500' : 'text-gray-500'}`}>
            {formatUSD(usdValue)}
          </div>
        </td>
      </tr>
    );
  };

  const calculateHashrateAdjustedEstimate = (baseEstimate: bigint) => {
    if (!minerHashrate || !averagePayment) return baseEstimate;
    
    const currentHashrateGhs = minerHashrate;
    const avgHashrateGhs = calculateAverageHashrate(recentPayments);
    
    if (avgHashrateGhs === 0) return baseEstimate;
    
    const adjustmentFactor = currentHashrateGhs / avgHashrateGhs;
    return BigInt(Math.round(Number(baseEstimate) * adjustmentFactor));
  };

  const calculateAverageHashrate = (payments: Payment[]): number => {
    if (payments.length < 2) return 0;
    
    const hashrates: number[] = [];
    for (let i = 1; i < payments.length; i++) {
      const interval = (payments[i-1].timestamp - payments[i].timestamp) / 1000;
      const amount = Number(payments[i].amount) / 1e8;
      if (interval > 0) {
        hashrates.push(amount / interval);
      }
    }
    
    return hashrates.length > 0 
      ? hashrates.reduce((a, b) => a + b, 0) / hashrates.length 
      : 0;
  };

  // Fix type errors in calculateHashrateStability
  const calculateHashrateStability = async (wallet: string | null): Promise<number> => {
    if (!wallet) return 1;
    
    const response = await $fetch(`/api/miner/workerHashrate?wallet=${wallet}`);
    if (response.status !== 'success') return 1;

    const last24Hours = response.data['24h'] || [];
    if (last24Hours.length === 0) return 1;

    // Fix type errors in the map and reduce functions
    const values = last24Hours.map((point: HashratePoint) => point.value);
    const mean = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    const variance = values.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return 1 - (stdDev / mean) * 0.1;
  };

  // Modify getAdjustedEstimate to include difficulty trend
  const getAdjustedEstimate = async (baseEstimate: bigint) => {
    if (!walletAddress) return baseEstimate;
    
    const [stabilityFactor, difficultyFactor] = await Promise.all([
      calculateHashrateStability(walletAddress),
      calculateDifficultyTrend()
    ]);
    
    const hashrateAdjusted = calculateHashrateAdjustedEstimate(baseEstimate);
    return BigInt(Math.round(
      Number(hashrateAdjusted) * 
      stabilityFactor * 
      difficultyFactor
    ));
  };

  // Fix the calculateDifficultyTrend function
  const calculateDifficultyTrend = async (): Promise<number> => {
    try {
      const response = await $fetch<{ status: string; data: DifficultyPoint[] }>('/api/pool/networkDifficulty/history');
      if (response.status !== 'success' || !response.data) return 1;

      const difficulties = response.data.slice(-12); // Last 12 hours
      if (difficulties.length < 2) return 1;

      const trend = difficulties.reduce((acc: number, curr: DifficultyPoint, idx: number, arr: DifficultyPoint[]) => {
        if (idx === 0) return acc;
        return acc + (curr.value / arr[idx - 1].value - 1);
      }, 0) / (difficulties.length - 1);

      // Return a factor between 0.9 and 1.1 based on trend
      return Math.max(0.9, Math.min(1.1, 1 + trend));
    } catch (error) {
      console.error('Error calculating difficulty trend:', error);
      return 1; // Default to no adjustment on error
    }
  };

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay for no wallet */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      {/* Blur overlay for no payments */}
      {walletAddress && !isLoading && !error && !hasPayments && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            We'll calculate your estimated earnings after your first payout
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Estimated Earnings</h2>
            <div className="group relative inline-block">
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium 
                ${isQualified 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400'
                } 
                flex items-center gap-1.5
              `}>
                <span className={`
                  w-2 h-2 rounded-full 
                  ${isQualified 
                    ? 'bg-green-500 dark:bg-green-400' 
                    : 'bg-gray-400 dark:bg-gray-500'
                  }
                `}></span>
                {isQualified ? 'Elite Miner' : 'Standard Miner'}
              </div>
              <div className="absolute left-0 top-full mt-2 w-72 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -top-[6px]"></div>
                  <div className="font-medium mb-1">
                    <strong>{isQualified ? 'Elite Miner Status' : 'Standard Miner Status'}</strong>
                  </div>
                  <p className="mb-2">
                    {isQualified 
                      ? 'This wallet qualifies for 100% pool fee rebates by holding either 100M+ NACHO tokens or at least 1 NACHO NFT.' 
                      : 'This wallet receives 33% pool fee rebates. Upgrade to Elite status by holding either 100M+ NACHO tokens or at least 1 NACHO NFT.'}
                  </p>
                  <div className="mt-3 pt-2 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                      Pool fees are paid back in $NACHO tokens after each payout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center">
            <div className="group">
              <button className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-500">
                <span className="sr-only">View information</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 right-4 -top-[6px]"></div>
                  <div className="font-medium mb-1"><strong>How we calculate estimates:</strong></div>
                  <p className="mb-2">Daily estimates are based on your most recent payout amount, doubled to account for two 12-hour intervals. Daily estimates are then extrapolated to calculate remaining periods.</p>
                  <p className="mb-2">
                    The <strong>NACHO rebate</strong> is a pool fee refund paid in $NACHO tokens. 
                    Wallets holding 100M+ NACHO tokens or at least 1 NACHO NFT receive 100% of pool fees back. 
                    Other wallets receive 33% of pool fees back.
                  </p>
                  <p className="mb-2">The <strong>USD value</strong> is calculated using the latest $KAS & $NACHO price from the Kaspa and CoinGecko APIs.</p>
                  <p className="text-gray-400">Note: These estimates are provided as a reference and are not guaranteed. Actual earnings will vary depending on conditions.</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Time Period</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">KAS Reward</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">NACHO Rebate</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">USD Value</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {renderRow('Hourly', calculateAmount(dailyKas, 1 / 24))}
              {renderRow('Daily', dailyKas)}
              {renderRow('Weekly', calculateAmount(dailyKas, 7))}
              {renderRow('Monthly', calculateAmount(dailyKas, 30))}
              {renderRow('Yearly', calculateAmount(dailyKas, 365))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
