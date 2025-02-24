'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { $fetch } from 'ofetch'
import { formatHashrate } from '@/components/utils/utils'

type SortDirection = 'asc' | 'desc'
type SortKey = 'rank' | 'wallet' | 'hashrate' | 'rewards24h' | 'nachoRebates' | 'poolShare' | 'firstSeen'

interface Miner {
  rank: number
  wallet: string
  hashrate: number
  rewards24h: number
  nachoRebates: number
  poolShare: number
  firstSeen: number
}

export default function TopMinersCard() {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [miners, setMiners] = useState<Miner[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const hashrateResponse = await $fetch('/api/pool/topMiners', {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!hashrateResponse || hashrateResponse.error) {
          throw new Error(hashrateResponse?.error || 'Failed to fetch hashrate data');
        }

        // Map API data to our simplified Miner interface
        const mappedMiners = hashrateResponse.data.map((miner: any) => ({
          rank: miner.rank,
          wallet: miner.wallet,
          hashrate: miner.hashrate,
          rewards24h: miner.rewards24h,
          nachoRebates: miner.nachoRebates || 0,
          poolShare: miner.poolShare,
          firstSeen: miner.firstSeen ? Math.floor((Date.now() / 1000 - miner.firstSeen) / (24 * 60 * 60)) : 0
        }));

        setMiners(mappedMiners);
        setError(null);
      } catch (error) {
        console.error('Error fetching top miners:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = [...miners].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    if (sortKey === 'wallet') {
      return a[sortKey].localeCompare(b[sortKey]) * modifier
    }
    
    return (a[sortKey] - b[sortKey]) * modifier
  })

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <span className={`ml-1 inline-block ${active ? 'text-primary-500' : 'text-gray-400'}`}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )

  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <div 
      className="font-semibold text-left cursor-pointer hover:text-primary-500 flex items-center justify-start"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon active={sortKey === key} direction={sortDirection} />
    </div>
  )

  const formatRewards = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Leaders</h2>
      </header>
      <div className="p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
                <tr>
                  <th className="p-2 whitespace-nowrap">
                    <SortableHeader label="Rank" sortKey="rank" />
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <SortableHeader label="Wallet" sortKey="wallet" />
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="flex justify-center">
                      <SortableHeader label="24h Hashrate" sortKey="hashrate" />
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="flex justify-center">
                      <SortableHeader label="24h Rewards" sortKey="rewards24h" />
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="flex justify-center">
                      <SortableHeader label="24h Rebates" sortKey="nachoRebates" />
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="flex justify-center">
                      <SortableHeader label="Pool Share" sortKey="poolShare" />
                    </div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="flex justify-center">
                      <SortableHeader label="First Seen" sortKey="firstSeen" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {sortedData.map((miner) => (
                  <tr key={miner.wallet}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left font-medium">#{miner.rank}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <Link 
                        href={`/miner?wallet=${miner.wallet}`}
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {miner.wallet}
                      </Link>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center font-medium">{formatHashrate(miner.hashrate)}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center text-green-500">
                        {miner.rewards24h > 0 ? `${formatRewards(miner.rewards24h)} KAS` : '--'}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        {miner.nachoRebates > 0 ? `${formatRewards(miner.nachoRebates)} NACHO` : '--'}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center">{miner.poolShare.toFixed(2)}%</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-center">{miner.firstSeen} days ago</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}