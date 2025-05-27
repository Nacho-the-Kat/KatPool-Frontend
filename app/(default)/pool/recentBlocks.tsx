'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { $fetch } from 'ofetch'
import { formatDistanceToNow } from 'date-fns'

interface Block {
  blockHash: string;
  daaScore: string;
  timestamp: string;
  miner_reward?: string;
  reward_block_hash: string;
}

export default function RecentBlocks() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await $fetch('/api/pool/recentBlocks?page=1&perPage=10', {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data');
        }
        // Filter out blocks with no reward_block_hash
        const blocksWithRewardBlockHash = response.data.blocks.filter((block: Block) => block.reward_block_hash);
       
        // blocks is an array of objects with blockHash, daaScore, timestamp, miner_reward, reward_block_hash
        setBlocks([...blocksWithRewardBlockHash]);
        setError(null);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Refresh every 10 minutes
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to format block hash
  const formatBlockHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  // Group blocks by day
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  // Take only the 6 most recent blocks
  const recentBlocks = blocks.slice(0, 6);

  const todayBlocks = recentBlocks.filter(block => new Date(block.timestamp).getTime() >= todayStart);
  const yesterdayBlocks = recentBlocks.filter(block => {
    const time = new Date(block.timestamp).getTime();
    return time >= yesterdayStart && time < todayStart;
  });

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recently Found Blocks</h2>
      </header>
      <div className="p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-500">{error}</div>
        ) : (
          <>
            {/* Today's blocks */}
            {todayBlocks.length > 0 && (
              <div>
                <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Today</header>
                <ul className="my-1">
                  {todayBlocks.map((block) => (
                    <li key={block.blockHash} className="flex px-2">
                      <div className="w-9 h-9 shrink-0 my-2 mr-3">
                        <Image
                          src="/images/kaspa-dark.svg"
                          alt="Kaspa Logo"
                          width={36}
                          height={36}
                          className="w-full h-full text-primary-500"
                        />
                      </div>
                      <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                        <div className="grow flex justify-between">
                          <div className="self-center">
                            Block <a 
                              className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" 
                              href={`https://explorer.kaspa.org/blocks/${block.blockHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{formatBlockHash(block.blockHash)}</a> found!
                            <span className="text-gray-500 dark:text-gray-400"> • Reward: </span>
                            <span className="text-green-500">{Number(block.miner_reward).toFixed(2)} KAS</span>
                          </div>
                          <div className="shrink-0 self-end ml-2">
                            <span className="text-gray-400 dark:text-gray-500">
                              {formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Yesterday's blocks */}
            {yesterdayBlocks.length > 0 && (
              <div>
                <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Yesterday</header>
                <ul className="my-1">
                  {yesterdayBlocks.map((block) => (
                    <li key={block.blockHash} className="flex px-2">
                      <div className="w-9 h-9 shrink-0 my-2 mr-3">
                        <Image
                          src="/images/kaspa-dark.svg"
                          alt="Kaspa Logo"
                          width={36}
                          height={36}
                          className="w-full h-full text-primary-500"
                        />
                      </div>
                      <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                        <div className="grow flex justify-between">
                          <div className="self-center">
                            Block <a 
                              className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" 
                              href={`https://explorer.kaspa.org/blocks/${block.blockHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >{formatBlockHash(block.blockHash)}</a> found!
                            {/* <span className="text-gray-500 dark:text-gray-400"> • Reward: </span> */}
                            {/* <span className="text-green-500">{block.reward} KAS</span> */}
                          </div>
                          <div className="shrink-0 self-end ml-2">
                            <span className="text-gray-400 dark:text-gray-500">
                              {formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Footer with link to full history */}
        <div className="px-5 py-4">
          <div className="flex justify-end">
            <Link 
              href="/blocks"
              className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Full Block History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
