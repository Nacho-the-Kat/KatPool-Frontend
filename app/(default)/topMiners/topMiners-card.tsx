'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { $fetch } from 'ofetch'
import { formatHashrate } from '@/components/utils/utils'
import { motion, AnimatePresence } from 'framer-motion'

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

interface PaginatedResponse {
  miners: Miner[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const PAGE_SIZE = 10;
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const ROW_HEIGHT = 48; // Height of each table row in pixels
const TABLE_HEADER_HEIGHT = 40; // Height of the table header in pixels
const TABLE_PADDING = 24; // Total vertical padding of the table container

export default function TopMinersCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableRef = useRef<HTMLDivElement>(null);
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [miners, setMiners] = useState<Miner[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalPages, setTotalPages] = useState(1)
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const isSubscribed = useRef(true);

  // Lift fetchData out of useEffect and make it a ref to avoid recreation
  const fetchDataRef = useRef(async (page: number = 1) => {
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      setIsLoading(true);

      // Sequential requests instead of parallel to avoid connection limits
      let hashrateResponse;
      let statsResponse;

      try {
        // TODO: backoff logic better handled in the API
        hashrateResponse = await $fetch(`/api/pool/topMiners?page=${page}&pageSize=${PAGE_SIZE}`, {
          timeout: 30000,
        });
        
        // TODO: backoff logic better handled in the API
        if (hashrateResponse?.data?.miners && !hashrateResponse.error) {
          statsResponse = await $fetch('/api/pool/minerStats', {
            timeout: 30000,
          });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Unknown error occurred';
        throw new Error(`API failed: ${errorMessage}`);
      }

      // Validate responses
      if (!hashrateResponse?.data?.miners || hashrateResponse.error) {
        throw new Error(hashrateResponse?.error || 'Invalid hashrate response');
      }

      // Continue even if stats fail
      const statsData = statsResponse?.data || {};

      // Map API data to our Miner interface
      const mappedMiners = hashrateResponse.data.miners.map((miner: any) => ({
        rank: miner.rank,
        wallet: miner.wallet,
        hashrate: miner.hashrate,
        rewards48h: miner.rewards48h,
        nachoRebates48h: miner.nachoRebates48h,
        poolShare: miner.poolShare,
        firstSeen: statsData[miner.wallet]?.firstSeen 
          ? Math.floor((Date.now() / 1000 - statsData[miner.wallet].firstSeen) / (24 * 60 * 60)) 
          : 0
      }));

      if (isSubscribed.current) {
        setMiners(mappedMiners);
        setTotalPages(hashrateResponse.data.totalPages);
        setCurrentPage(hashrateResponse.data.page);
        setError(null);
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
    isSubscribed.current = true;

    // Initial fetch
    fetchDataRef.current(currentPage);

    // Setup refresh with setTimeout instead of setInterval
    const scheduleNextFetch = () => {
      timeoutId = setTimeout(() => {
        fetchDataRef.current(currentPage).finally(() => {
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
  }, [currentPage]);

  // Recovery logic
  useEffect(() => {
    if (error) {
      const retryTimeout = setTimeout(() => {
        setError(null);
        fetchDataRef.current(currentPage);
      }, 30000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [error, currentPage]);

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isPageTransitioning) {
      setIsPageTransitioning(true);
      
      // Store current scroll position
      const currentScroll = window.scrollY;
      
      // Update URL without scrolling
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
      
      // Update page and fetch data
      setCurrentPage(newPage);
      await fetchDataRef.current(newPage);
      
      // Restore scroll position
      window.scrollTo({
        top: currentScroll,
        behavior: 'instant'
      });
      
      setIsPageTransitioning(false);
    }
  };

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

  // Calculate table height based on number of rows
  const tableHeight = TABLE_HEADER_HEIGHT + (PAGE_SIZE * ROW_HEIGHT) + TABLE_PADDING;

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Leaders</h2>
      </header>
      <div className="p-3">
        <div style={{ height: tableHeight, minHeight: tableHeight }} ref={tableRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
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
                <AnimatePresence mode="wait">
                  <motion.tbody
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeInOut",
                      staggerChildren: 0.05
                    }}
                    className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60"
                  >
                    {sortedData.map((miner, index) => (
                      <motion.tr
                        key={miner.wallet}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.02
                        }}
                        style={{ height: ROW_HEIGHT }}
                      >
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
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isPageTransitioning}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isPageTransitioning}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current page
                const shouldShow = 
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  Math.abs(pageNumber - currentPage) <= 1;

                if (!shouldShow) {
                  // Show ellipsis for skipped pages
                  if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}