'use client'

import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import { Download } from 'lucide-react'

type SortDirection = 'asc' | 'desc'
type SortKey = 'timestamp' | 'transactionHash' | 'kasAmount' | 'nachoAmount'

interface Payout {
  walletAddress: string
  amount: number
  timestamp: number
  transactionHash: string
}

interface AggregatedPayout {
  amount: number
  timestamp: number
  transactionHash: string
}

const downloadCSV = (data: AggregatedPayout[]) => {
  const headers = ['Time', 'Transaction Hash', 'KAS Amount', 'NACHO Amount']
  const csvContent = [
    headers.join(','),
    ...data.map(payout => [
      new Date(payout.timestamp).toISOString(),
      payout.transactionHash,
      payout.amount.toFixed(8),
      '0.00'
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

export default function PoolPayoutsCard() {
  const [isLoading, setIsLoading] = useState(true)
  const [payouts, setPayouts] = useState<AggregatedPayout[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setIsLoading(true)
        const response = await $fetch('/api/pool/payouts')
        if (response.status === 'success') {
          // Filter for KAS payouts and map to simpler structure
          const kasPayouts = response.data
            .filter((payout: any) => payout.type === 'kas')
            .map((payout: any) => ({
              amount: Number(payout.kasAmount || 0),
              timestamp: payout.timestamp,
              transactionHash: payout.transactionHash
            }));

          setPayouts(kasPayouts)
        }
      } catch (error) {
        console.error('Error fetching payouts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayouts()
  }, [])

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
        return (a.amount - b.amount) * modifier
      case 'nachoAmount':
        return 0 * modifier
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

  if (isLoading) {
    return (
      <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="relative col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Payouts</h2>
        <button
          onClick={() => downloadCSV(sortedPayouts)}
          className="p-1.5 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          title="Export as CSV"
        >
          <Download className="w-5 h-5" />
        </button>
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
                <tr key={payout.transactionHash}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {formatTimestamp(payout.timestamp)}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <a 
                        href={`https://kas.fyi/transaction/${payout.transactionHash}`}
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
                      {payout.amount > 0 ? `${formatAmount(payout.amount)} KAS` : '--'}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <span className="text-[13px] text-gray-500 dark:text-gray-400">
                        '0.00'
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