'use client'

import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import { Download } from 'lucide-react'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'transactionHash' | 'kasAmount' | 'nachoAmount'

interface Payout {
  id: number
  timestamp: number
  transactionHash: string
  kasAmount?: string
  nachoAmount?: string
  type: 'kas' | 'nacho'
}

interface PoolPayoutsCardProps {
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  totalItems: number
  payouts: Payout[]
  isLoading: boolean
  error: string | null
}

const downloadCSV = (data: Payout[]) => {
  const headers = ['Time', 'Transaction Hash', 'KAS Amount', 'NACHO Amount']
  const csvContent = [
    headers.join(','),
    ...data.map(payout => [
      new Date(payout.timestamp).toISOString(),
      payout.transactionHash,
      payout.kasAmount || '0',
      payout.nachoAmount || '0'
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `pool-payouts-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function PoolPayoutsCard({ 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  onItemsPerPageChange,
  totalItems,
  payouts,
  isLoading,
  error
}: PoolPayoutsCardProps) {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    return `${dateStr} @ ${timeStr}`
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const sortedPayouts = [...payouts].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    switch (sortKey) {
      case 'timestamp':
        return (a.timestamp - b.timestamp) * modifier
      case 'transactionHash':
        return a.transactionHash.localeCompare(b.transactionHash) * modifier
      case 'kasAmount':
        return ((a.kasAmount ? Number(a.kasAmount) : 0) - (b.kasAmount ? Number(b.kasAmount) : 0)) * modifier
      case 'nachoAmount':
        return ((a.nachoAmount ? Number(a.nachoAmount) : 0) - (b.nachoAmount ? Number(b.nachoAmount) : 0)) * modifier
      default:
        return 0
    }
  })

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <span className={`ml-1 inline-block ${active ? 'text-primary-500' : 'text-gray-400'}`}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  )

  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <div 
      className="font-semibold cursor-pointer hover:text-primary-500 flex items-center justify-center"
      onClick={() => handleSort(key)}
    >
      {label}
      <SortIcon active={sortKey === key} direction={sortDirection} />
    </div>
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage)
    }
  }

  if (isLoading) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8">
        <div className="flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Payouts</h2>
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
          <button
            onClick={() => downloadCSV(sortedPayouts)}
            className="p-1.5 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            title="Export as CSV"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Time" sortKey="timestamp" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Transaction" sortKey="transactionHash" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="KAS Amount" sortKey="kasAmount" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="NACHO Rebate" sortKey="nachoAmount" />
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {formatTimestamp(payout.timestamp)}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <a 
                        href={`https://kaspa.stream/transactions/${payout.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <span className="hidden md:inline">{payout.transactionHash}</span>
                        <span className="md:hidden">{`${payout.transactionHash.slice(0, 8)}...${payout.transactionHash.slice(-8)}`}</span>
                      </a>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center text-green-500">
                      {payout.kasAmount ? `${formatAmount(Number(payout.kasAmount))} KAS` : '--'}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <span className="text-[13px] text-gray-500 dark:text-gray-400">
                        {payout.nachoAmount ? `${formatAmount(Number(payout.nachoAmount))} NACHO` : '--'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700/60 mt-4" />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 pr-7 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
            <span className="text-sm text-gray-700 dark:text-gray-300">Records</span>
          </div>
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
        </div>
      </div>
    </div>
  )
}