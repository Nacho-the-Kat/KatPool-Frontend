'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import FallbackMessage from '@/components/elements/fallback-message'

interface Payout {
  wallet_address: string
  nacho_amount?: number
  amount?: number
  timestamp: string
  transaction_hash: string
  payment_type: 'KAS' | 'NACHO'
}

interface AggregatedPayout {
  amount: number
  timestamp: number
  transactionHash: string
}

export default function PoolPayouts() {
  const [payouts, setPayouts] = useState<AggregatedPayout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setError(null)
        const response = await $fetch('/api/pool/payouts')
        console.log('API Response:', response)
        console.log('Response type:', typeof response)
        console.log('Response.data type:', typeof response.data)
        console.log('Response.data:', response.data)
        
        if (response.status === 'success') {
          // Check if response.data is an array, if not, try to access it differently
          const payoutsData = Array.isArray(response.data) ? response.data : response.data?.payouts || response.data?.data || response.data
          console.log('Payouts data:', payoutsData)
          
          if (!Array.isArray(payoutsData)) {
            console.error('Payouts data is not an array:', payoutsData)
            setError('Invalid data format received')
            return
          }
          
          // Filter for KAS payouts only
          const kasPayouts = payoutsData.filter((payout: Payout) => payout.amount && payout.amount > 0);
          console.log('KAS payouts:', kasPayouts)
          
          // Aggregate payouts by transaction hash
          const aggregated = Object.values(
            kasPayouts.reduce((acc: Record<string, AggregatedPayout>, payout: Payout) => {
              if (!acc[payout.transaction_hash]) {
                acc[payout.transaction_hash] = {
                  amount: 0,
                  timestamp: new Date(payout.timestamp).getTime(),
                  transactionHash: payout.transaction_hash
                }
              }
              // Convert kas_amount to number
              const amount = payout.amount ? payout.amount : 0
              acc[payout.transaction_hash].amount += amount
              return acc
            }, {})
          ) as AggregatedPayout[]
          console.log('Aggregated payouts:', aggregated)
          setPayouts(aggregated)
        } else {
          setError('Failed to fetch pool payouts')
        }
      } catch (error) {
        console.error('Error fetching pool payouts:', error)
        setError(error instanceof Error ? error.message : 'Failed to load pool payouts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayouts()
  }, [])

  const formatAmount = (amount: number) => {
    // Convert from raw amount to KAS (assuming 1 KAS = 100000000 sompi)
    const kasAmount = amount / 100000000
    return kasAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 3)}...${hash.slice(-3)}`
  }

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    }
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    }
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  // Group payouts by day and limit to recent payouts
  const groupedPayouts = payouts
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent first
    .slice(0, 4) // Limit to 4 most recent payouts
    .reduce((groups: Record<string, AggregatedPayout[]>, payout) => {
      const date = new Date(payout.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      let day
      if (date.toDateString() === today.toDateString()) {
        day = 'TODAY'
      } else if (date.toDateString() === yesterday.toDateString()) {
        day = 'YESTERDAY'
      } else {
        day = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
      }
      
      if (!groups[day]) {
        groups[day] = []
      }
      groups[day].push(payout)
      return groups
    }, {})

  // Log groupedPayouts values for debugging
  console.log('groupedPayouts:', groupedPayouts)

  if (isLoading) {
    return (
      <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Pool Payouts</h2>
        </header>
        <div className="p-3">
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Pool Payouts</h2>
      </header>
      <div className="p-3">
        {error || payouts.length === 0 ? (
          <FallbackMessage
            title="No recent payouts available"
            message="Check back soon for new pool payouts"
          >
            <div>
              <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">Today</header>
              <ul className="my-1">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex px-2">
                    <div className="w-9 h-9 shrink-0 my-2 mr-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                      <div className="grow flex justify-between">
                        <div className="self-center">
                          <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                          <span className="text-gray-500 dark:text-gray-400"> • </span>
                          <span className="text-green-500">123.45 KAS</span>
                          <span className="text-gray-500 dark:text-gray-400"> • </span>
                          <span className="text-gray-500 dark:text-gray-400">abc...def</span>
                        </div>
                        <div className="shrink-0 self-end ml-2">
                          <span className="text-gray-400 dark:text-gray-500">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FallbackMessage>
        ) : (
          <>
            {Object.entries(groupedPayouts).map(([day, dayPayouts], index) => (
              <div key={day}>
                <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
                  {index === 0 ? 'Today' : day}
                </header>
                <ul className="my-1">
                  {dayPayouts.map((payout) => (
                    <li key={payout.transactionHash} className="flex px-2">
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
                            <span className="font-medium text-gray-800 dark:text-gray-100">Pool Payout</span>
                            <span className="text-gray-500 dark:text-gray-400"> • </span>
                            <span className="text-green-500">{formatAmount(payout.amount)} KAS</span>
                            <span className="text-gray-500 dark:text-gray-400"> • </span>
                            <a
                              href={`https://explorer.kaspa.org/txs/${payout.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                            >
                              {formatTxHash(payout.transactionHash)}
                            </a>
                          </div>
                          <div className="shrink-0 self-end ml-2">
                            <span className="text-gray-400 dark:text-gray-500">{getRelativeTime(payout.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {/* Footer with link to full history */}
        <div className="px-5 py-4">
          <div className="flex justify-end">
            <Link 
              href="/poolPayouts"
              className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Pool Payout History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
