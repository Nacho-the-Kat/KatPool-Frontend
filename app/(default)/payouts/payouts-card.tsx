'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { $fetch } from 'ofetch'
import { Download } from 'lucide-react'

interface Payout {
  id: number
  timestamp: number
  transactionHash: string
  walletAddress: string
  kasAmount?: string
  nachoAmount?: string
  type: 'kas' | 'nacho'
}

interface PayoutsCardProps {
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
  const headers = ['Time', 'Transaction Hash', 'KAS Amount', 'NACHO Amount', 'Wallet Address']
  const csvContent = [
    headers.join(','),
    ...data.map(payout => [
      new Date(payout.timestamp).toISOString(),
      payout.transactionHash,
      payout.kasAmount || '0',
      payout.nachoAmount || '0',
      payout.walletAddress
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `wallet-payouts-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function PayoutsCard({ 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  onItemsPerPageChange,
  totalItems,
  payouts,
  isLoading,
  error
}: PayoutsCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    // Handle wallet address initialization
    const queryWallet = searchParams.get('wallet')
    const savedWallet = localStorage.getItem('kaspaWalletAddress')
    
    if (queryWallet) {
      setWalletAddress(queryWallet)
    } else if (savedWallet && !queryWallet) {
      // Only redirect if we have a saved wallet but no query parameter
      // This prevents infinite redirects
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.set('wallet', savedWallet)
      router.replace(currentUrl.toString())
      setWalletAddress(savedWallet)
    }
  }, [router, searchParams])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage)
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
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view payout history
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 break-all">
          {walletAddress 
            ? `Payout History for ${walletAddress}`
            : 'Payout History'
          }
        </h2>
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
          {walletAddress && (
            <button
              onClick={() => downloadCSV(payouts)}
              className="p-1.5 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              title="Export as CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
      
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Time</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Transaction</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">KAS Amount</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">NACHO Rebate</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {payouts.map((payout) => (
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
                    <div className="text-center font-medium">
                      {payout.type === 'nacho' && payout.nachoAmount ? `${formatAmount(Number(payout.nachoAmount))} NACHO` : '--'}
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
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
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
