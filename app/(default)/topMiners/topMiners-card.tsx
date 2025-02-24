'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { $fetch } from 'ofetch'
import { formatHashrate } from '@/components/utils/utils'

type SortDirection = 'asc' | 'desc'
type SortKey = 'rank' | 'wallet' | 'hashrate' | 'rewards48h' | 'nachoRebates48h' | 'poolShare' | 'firstSeen'

interface Miner {
  rank: number
  wallet: string
  hashrate: number
  rewards48h: number
  nachoRebates48h: number
  poolShare: number
  firstSeen: number
}

interface MinerStats {
  firstSeen: number
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

interface ApiResponse {
  status: 'success' | 'error'
  data: Miner[]
  pagination?: PaginationData
  error?: string
}

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const CACHE_DURATION = REFRESH_INTERVAL - 10000; // Slightly less than refresh interval
const STALE_WHILE_REVALIDATE = 5 * 60 * 1000; // 5 minutes
const ITEMS_PER_PAGE = 50;

const getCachedData = () => {
  try {
    const cached = localStorage.getItem('topMinersData');
    const timestamp = localStorage.getItem('topMinersTimestamp');
    
    if (!cached || !timestamp) return null;
    
    const parsedTimestamp = parseInt(timestamp);
    const age = Date.now() - parsedTimestamp;
    
    // Return data with freshness indicator
    return {
      data: JSON.parse(cached),
      isStale: age >= CACHE_DURATION,
      isTooOld: age >= (CACHE_DURATION + STALE_WHILE_REVALIDATE)
    };
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

// Add retry helper
const fetchWithBackoff = async (url: string, options: any, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await $fetch(url, {
        ...options,
        timeout: 30000 * (attempt + 1), // Increase timeout with each retry
      });
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default function TopMinersCard() {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [miners, setMiners] = useState<Miner[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMiners, setTotalMiners] = useState(0)
  const isSubscribed = useRef(true);

  const fetchDataRef = useRef(async () => {
    if (isFetching) return;
    
    try {
      // Check cache first
      const cache = getCachedData();
      
      if (cache && !cache.isTooOld) {
        setMiners(cache.data);
        setError(null);
        
        if (cache.isStale) {
          setIsFetching(true);
        } else {
          return;
        }
      } else {
        setIsFetching(true);
        setIsLoading(true);
      }

      const hashrateResponse = await fetchWithBackoff(
        `/api/pool/topMiners?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          retry: 2,
          retryDelay: 3000,
        }
      ) as ApiResponse;

      if (!hashrateResponse?.data || hashrateResponse.error) {
        throw new Error(hashrateResponse?.error || 'Invalid response');
      }

      if (isSubscribed.current) {
        setMiners(hashrateResponse.data);
        if (hashrateResponse.pagination) {
          setTotalPages(hashrateResponse.pagination.pages);
          setTotalMiners(hashrateResponse.pagination.total);
        }
        setError(null);

        // Only cache first page
        if (currentPage === 1) {
          localStorage.setItem('topMinersData', JSON.stringify(hashrateResponse.data));
          localStorage.setItem('topMinersTimestamp', Date.now().toString());
        }
      }
    } catch (error) {
      if (isSubscribed.current) {
        console.error('Error fetching top miners:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      }
    } finally {
      if (isSubscribed.current) {
        setIsLoading(false);
        setIsFetching(false);
      }
    }
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Initial fetch
    fetchDataRef.current();

    // Setup refresh with setTimeout instead of setInterval
    const scheduleNextFetch = () => {
      timeoutId = setTimeout(() => {
        fetchDataRef.current().finally(() => {
          if (isSubscribed.current) {
            scheduleNextFetch();
          }
        });
      }, REFRESH_INTERVAL);
    };

    scheduleNextFetch();
    
    return () => {
      isSubscribed.current = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Recovery logic can now access fetchDataRef
  useEffect(() => {
    if (error) {
      const cache = getCachedData();
      if (cache?.data) {
        setMiners(cache.data);
      }
      
      const retryTimeout = setTimeout(() => {
        setError(null);
        fetchDataRef.current();
      }, 30000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [error]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setIsLoading(true);
    fetchDataRef.current();
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
          <>
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
                        <SortableHeader label="48h Hashrate" sortKey="hashrate" />
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="flex justify-center">
                        <SortableHeader label="48h Rewards" sortKey="rewards48h" />
                      </div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="flex justify-center">
                        <SortableHeader label="48h Rebates" sortKey="nachoRebates48h" />
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
                          {miner.rewards48h > 0 ? `${formatRewards(miner.rewards48h)} KAS` : '--'}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          {miner.nachoRebates48h > 0 ? `${formatRewards(miner.nachoRebates48h)} NACHO` : '--'}
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
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages} ({totalMiners} miners)
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}