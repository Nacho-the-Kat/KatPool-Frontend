'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import { Download } from 'lucide-react'

type SortDirection = 'asc' | 'desc'
type SortKey = 'date' | 'payment_id' | 'amount'

interface UpholdPayout {
  payment_id: string
  amount: string
  asset: string
  status: string
  date: string
}

const downloadCSV = (data: UpholdPayout[]) => {
  const headers = ['Payment ID', 'Amount', 'Asset', 'Status', 'Date']
  const csvContent = [
    headers.join(','),
    ...data.map(payout => [
      payout.payment_id,
      payout.amount,
      payout.asset,
      payout.status,
      payout.date
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `uphold-payouts-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function UpholdPayoutsCard() {
  const [isLoading, setIsLoading] = useState(true)
  const [payouts, setPayouts] = useState<UpholdPayout[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setIsLoading(true)
        const response = await $fetch('/api/uphold/payouts')
        if (response.status === 'success') {
          setPayouts(response.data)
        }
      } catch (error) {
        console.error('Error fetching Uphold payouts:', error)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
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

  const formatAmount = (amount: string) => {
    return Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const sortedPayouts = [...payouts].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1
    
    switch (sortKey) {
      case 'date':
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier
      case 'payment_id':
        return a.payment_id.localeCompare(b.payment_id) * modifier
      case 'amount':
        return (Number(a.amount) - Number(b.amount)) * modifier
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
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Uphold Payout History</h2>
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
                  <SortableHeader label="Date" sortKey="date" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Payment ID" sortKey="payment_id" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <SortableHeader label="Amount" sortKey="amount" />
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Asset</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Status</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {sortedPayouts.map((payout) => (
                <tr key={payout.payment_id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {formatDate(payout.date)}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <span className="text-primary-500">
                        {payout.payment_id}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center text-green-500">
                      {formatAmount(payout.amount)}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {payout.asset}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payout.status === 'completed' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                      }`}>
                        {payout.status}
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