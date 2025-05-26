'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'daaScore' | 'blockHash' | 'miner_reward'

interface Block {
  blockHash: string
  miner_id: string
  pool_address: string
  reward_block_hash: string
  wallet: string
  daaScore: string
  miner_reward: string
  timestamp: string
}

interface BlocksCardProps {
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  totalItems: number
  blocks: Block[]
  isLoading: boolean
  error: string | null
}

export default function BlocksCard({ 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  totalItems,
  blocks,
  isLoading,
  error
}: BlocksCardProps) {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }
  console.log('blocks', blocks);

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/blocks?page=${newPage}`)
      onPageChange(newPage)
    }
  }

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
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Found Blocks</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
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
                  <SortableHeader label="Miner Reward" sortKey="miner_reward" className="justify-end" />
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {blocks.map((block) => (
                <tr key={block.blockHash}>
                  <td className="p-2">
                    <div className="text-left">
                      {formatDateTime(block.timestamp)}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-left">
                      <a 
                        href={`https://explorer.kaspa.org/blocks/${block.mined_block_hash}`}
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
                    <div className="text-right">
                      {block.miner_reward ? `${Number(block.miner_reward).toFixed(2)} KAS` : '-'}
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
