'use client'

import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import { format } from 'date-fns'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'daaScore' | 'reward' | 'blockHash'

interface Block {
  blockHash: string
  daaScore: string
  timestamp: string
  reward?: string
  fullReward?: string
}

export default function BlocksCard() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await $fetch('/api/pool/recentBlocks', {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data');
        }

        // Fetch reward amounts for each block
        const blocksWithRewards = await Promise.all(
          response.data.blocks.map(async (block: Block) => {
            try {
              const rewardResponse = await $fetch(`/api/pool/blockReward?blockHash=${block.blockHash}`, {
                retry: 3,
                retryDelay: 1000,
                timeout: 10000,
              });
              return {
                ...block,
                reward: rewardResponse.data.amount,
                fullReward: rewardResponse.data.fullAmount
              };
            } catch (error) {
              console.error(`Error fetching reward for block ${block.blockHash}:`, error);
              return {
                ...block,
                reward: '--',
                fullReward: '--'
              };
            }
          })
        );

        setBlocks(blocksWithRewards);
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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedData = [...blocks].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    switch (sortKey) {
      case 'timestamp':
        return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * modifier
      case 'daaScore':
        return (Number(a.daaScore) - Number(b.daaScore)) * modifier
      case 'reward':
        return ((a.reward === '--' ? 0 : Number(a.reward)) - (b.reward === '--' ? 0 : Number(b.reward))) * modifier
      case 'blockHash':
        return a.blockHash.localeCompare(b.blockHash) * modifier
      default:
        return 0
    }
  })

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <span className={`ml-1 inline-block ${active ? 'text-primary-500' : 'text-gray-400'}`}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )

  const SortableHeader = ({ label, sortKey: key, className = '' }: { label: string; sortKey: SortKey; className?: string }) => (
    <div 
      className={`font-semibold cursor-pointer hover:text-primary-500 flex items-center ${className}`}
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon active={sortKey === key} direction={sortDirection} />
    </div>
  )

  const formatBlockHash = (hash: string) => {
    return hash;
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "MMM d, yyyy '@' h:mma");
  };

  if (isLoading) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8">
        <div className="flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Found Blocks</h2>
      </header>
      
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <SortableHeader label="Time" sortKey="timestamp" className="justify-start" />
                </th>
                <th className="p-2">
                  <SortableHeader label="Block Hash" sortKey="blockHash" className="justify-start" />
                </th>
                <th className="p-2">
                  <SortableHeader label="DAA Score" sortKey="daaScore" className="justify-end" />
                </th>
                <th className="p-2">
                  <SortableHeader label="Reward" sortKey="reward" className="justify-end" />
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedData.map((block) => (
                <tr key={block.blockHash}>
                  <td className="p-2">
                    <div className="text-left">
                      {formatDateTime(block.timestamp)}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-left">
                      <a 
                        href={`https://explorer.kaspa.org/blocks/${block.blockHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {formatBlockHash(block.blockHash)}
                      </a>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-right">
                      {block.daaScore}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-right font-medium text-green-500">
                      <span title={block.fullReward !== '--' ? `Full amount: ${block.fullReward} KAS` : ''}>
                        {block.reward} KAS
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
