'use client'

import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import BlocksCard from './blocks-card'

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

interface Pagination {
  currentPage: number
  perPage: number
  totalCount: number
  totalPages: number
}

export default function Blocks() {
  const [currentPage, setCurrentPage] = useState(1)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 1
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await $fetch('/api/pool/recentBlocks', {
          params: {
            page: currentPage,
            perPage: pagination.perPage
          },
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        })
        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data')
        }

        setBlocks(response.data.blocks)
        setPagination(response.data.pagination)
        setError(null)
      } catch (error) {
        console.error('Error fetching blocks:', error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    // Refresh every 10 minutes
    const interval = setInterval(fetchData, 600000)
    return () => clearInterval(interval)
  }, [currentPage, pagination.perPage])

  const handleItemsPerPageChange = (newPerPage: number) => {
    setPagination((prev) => ({ ...prev, perPage: newPerPage }));
    setCurrentPage(1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Found Blocks History</h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
        <BlocksCard 
          currentPage={currentPage}
          itemsPerPage={pagination.perPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={pagination.totalCount}
          blocks={blocks}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
