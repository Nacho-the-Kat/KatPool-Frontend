'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { $fetch } from 'ofetch'
import { useNachoPrice } from './nacho-price-context'

interface Payout {
  walletAddress: string
  kasAmount?: string
  nachoAmount?: string
  timestamp: number
  transactionHash: string
  type: 'kas' | 'nacho'
}

export default function AnalyticsCard02() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingBalance, setPendingBalance] = useState<string>('--')
  const [recentPayouts, setRecentPayouts] = useState<Payout[]>([])
  const [pendingNachoRebate, setPendingNachoRebate] = useState<string>('--')
  const [kasPrice, setKasPrice] = useState<number | null>(null)
  const { price: nachoPrice, isLoading: nachoPriceLoading } = useNachoPrice()

  // Replace both balance and rebate effects with a single one
  useEffect(() => {
    const fetchBalances = async () => {
      if (!walletAddress) return;

      try {
        setIsLoading(true);
        const [balanceRes, kasPriceRes] = await Promise.all([
          $fetch(`/api/miner/combinedBalance?wallet=${walletAddress}`, {
            retry: 3,
            retryDelay: 1000,
            timeout: 10000,
          }),
          $fetch('/api/pool/price')
        ]);

        if (!balanceRes || balanceRes.status !== 'success' || !balanceRes.data) {
          throw new Error('Failed to fetch balance data');
        }

        // Set KAS pending balance with validation
        try {
          const kasAmount = Number(BigInt(balanceRes.data.pendingBalance)) / 1e8;
          setPendingBalance(Number.isFinite(kasAmount) ? kasAmount.toFixed(2) : '--');
        } catch (e) {
          console.error('Error processing KAS balance:', e);
          setPendingBalance('--');
        }

        // Calculate NACHO rebate amount with validation
        if (kasPriceRes.status === 'success' && nachoPrice !== null) {
          try {
            const rebateKasAmount = Number(BigInt(balanceRes.data.pendingRebate)) / 1e8;
            const nachoAmount = (rebateKasAmount * kasPriceRes.data.price) / nachoPrice;
            setPendingNachoRebate(Number.isFinite(nachoAmount) ? nachoAmount.toFixed(3) : '--');
          } catch (e) {
            console.error('Error processing NACHO rebate:', e);
            setPendingNachoRebate('--');
          }
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching balances:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setPendingBalance('ERR');
        setPendingNachoRebate('ERR');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
    // Refresh every minute
    const interval = setInterval(fetchBalances, 60000);
    return () => clearInterval(interval);
  }, [walletAddress, nachoPrice]);

  // Fetch recent payouts
  useEffect(() => {
    const fetchPayouts = async () => {
      if (!walletAddress) return;

      try {
        const response = await $fetch('/api/pool/payouts')
        if (response.status === 'success') {
          // Filter payouts for this wallet and take the 4 most recent
          const walletPayouts = response.data
            .filter((payout: Payout) => payout.walletAddress === walletAddress)
            .sort((a: Payout, b: Payout) => b.timestamp - a.timestamp)
            .slice(0, 4);
          setRecentPayouts(walletPayouts);
        }
      } catch (error) {
        console.error('Error fetching payouts:', error)
      }
    };

    fetchPayouts();
    // Refresh every minute
    const interval = setInterval(fetchPayouts, 60000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Rewards</h2>
          <div className="relative flex items-center">
            <div className="group">
              <button className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-500">
                <span className="sr-only">View information</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                </svg>
              </button>
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-72 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 right-[-6px] top-1/2 -translate-y-1/2"></div>
                  <div className="font-medium mb-1"><strong>About NACHO Rebates:</strong></div>
                  <p className="mb-2">The Nacho rebate is a 0.25% pool fee refund, paid to you in $NACHO tokens. After each payout period, the pool automatically swaps one-third of the fees earned from $KAS to $NACHO and distributes them proportionally to Kat Pool miners. Rebates are paid within an hour of every rewards payout.</p>
                  <p className="mb-2">Below, you can see your recent earnings and rebate payments. Use the "Full Payout History" button at the bottom to view the complete history of payouts for this wallet.</p>
                  <p className="text-gray-400">This is our way of saying thank you for helping secure the Kaspa network. Meow 🐈‍⬛</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="grow px-5 py-4">
        <div className="flex items-end justify-between pr-10">
          <div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{pendingBalance} KAS</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pending Balance</div>
          </div>
          <div>
            <div>
              <div className="flex items-center justify-end">
                <div className="text-xl font-bold text-gray-400 dark:text-gray-500 text-right">
                  {Number(pendingNachoRebate).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} NACHO
                </div>
                <div className="group relative ml-2">
                  <button className="flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View information</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                    </svg>
                  </button>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-72 bg-gray-800 text-xs text-white p-3 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 right-[-6px] top-1/2 -translate-y-1/2"></div>
                      <div className="font-medium mb-1"><strong>About Pending NACHO Rebates:</strong></div>
                      <p className="mb-2">
                        This is an estimate of your pending NACHO token rebates from recent mining activity. The actual amount may vary based on:
                      </p>
                      <ul className="list-disc pl-4 mb-2 space-y-1">
                        <li>Pool fee rate (0.75%)</li>
                        <li>Your qualification status (100% or 33% rebate)</li>
                        <li>Current KAS and NACHO token prices</li>
                        <li>Swap execution prices</li>
                      </ul>
                      <p className="text-gray-400">Rebates are distributed within an hour after each KAS payout.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">Pending Rebate</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grow px-5 pt-3 pb-1">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500">
              <tr>
                <th className="py-2">
                  <div className="font-semibold text-left">Recent Payouts</div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right">Reward</div>
                </th>
                <th className="py-2">
                  <div className="font-semibold text-right">Rebate</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {recentPayouts.map((payout) => (
                <tr key={payout.transactionHash}>
                  <td className="py-2">
                    <div className="text-left text-gray-500">
                      {formatTimestamp(payout.timestamp)}
                      <span className="mx-2">•</span>
                      <a
                        href={`https://kas.fyi/transaction/${payout.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-500 dark:hover:text-primary-400"
                      >
                        {formatTxHash(payout.transactionHash)}
                      </a>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-gray-800 dark:text-gray-100">
                      {payout.type === 'kas' && payout.kasAmount ? `${formatAmount(Number(payout.kasAmount))} KAS` : '--'}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-green-500">
                      {payout.type === 'nacho' && payout.nachoAmount ? `${formatAmount(Number(payout.nachoAmount))} NACHO` : '--'}
                    </div>
                  </td>
                </tr>
              ))}
              {/* Fill remaining rows with placeholders if less than 4 payouts */}
              {Array.from({ length: Math.max(0, 4 - recentPayouts.length) }).map((_, index) => (
                <tr key={`placeholder-${index}`}>
                  <td className="py-2">
                    <div className="text-left text-gray-500">--</div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-gray-800 dark:text-gray-100">--</div>
                  </td>
                  <td className="py-2">
                    <div className="font-medium text-right text-green-500">--</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Card footer */}
      <div className="px-5 py-4">
        <div className="flex justify-end">
          <Link
            className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            href={`/payouts?wallet=${searchParams.get('wallet') || ''}`}
          >
            Full Payout History →
          </Link>
        </div>
      </div>
    </div>
  )
}
