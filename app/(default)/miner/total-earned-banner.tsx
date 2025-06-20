'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { $fetch } from 'ofetch'
import Image from 'next/image'

interface TotalEarnedData {
  totalKas: number
  totalNacho: number
}

export default function TotalEarnedBanner() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<TotalEarnedData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletAddress = searchParams.get('wallet')

  useEffect(() => {
    const fetchTotalEarned = async () => {
      if (!walletAddress) {
        setData(null)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch both KAS and NACHO totals in parallel
        const [kasResponse, nachoResponse] = await Promise.all([
          $fetch(`/api/pool/totalPaidKAS?wallet=${encodeURIComponent(walletAddress)}`, {
            retry: 2,
            timeout: 10000,
          }),
          $fetch(`/api/pool/totalPaidNACHO?wallet=${encodeURIComponent(walletAddress)}`, {
            retry: 2,
            timeout: 10000,
          })
        ])

        if (kasResponse.status === 'success' && nachoResponse.status === 'success') {
          setData({
            totalKas: kasResponse.data.totalPaidKAS / 1e8, // Convert from satoshis to KAS
            totalNacho: nachoResponse.data.totalPaidNACHO / 1e8 // Convert from satoshis to NACHO
          })
        } else {
          throw new Error('Failed to fetch total earned data')
        }
      } catch (err) {
        console.error('Error fetching total earned:', err)
        setError('Failed to load total earned data')
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTotalEarned()
  }, [walletAddress])

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4">
        {!walletAddress ? (
          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="text-primary-500">
                  <Image src="/images/kaspa-dark-wide.svg" alt="Kaspa Logo" width={32} height={32} className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Total Earned KAS:</span>
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">--</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-primary-500">
                  <Image src="/images/nacho.svg" alt="Nacho Logo" width={32} height={32} className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Total Earned NACHO:</span>
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">--</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="text-primary-500">
                  <Image src="/images/kaspa-dark-wide.svg" alt="Kaspa Logo" width={32} height={32} className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Earned KAS:</span>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                ) : error ? (
                  <span className="text-sm text-red-500 dark:text-red-400">Error</span>
                ) : data ? (
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {formatAmount(data.totalKas)} KAS
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">--</span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
              <div className="text-primary-500">
                  <Image src="/images/nacho.svg" alt="Nacho Logo" width={32} height={32} className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Earned NACHO:</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : error ? (
                    <span className="text-sm text-red-500 dark:text-red-400">Error</span>
                  ) : data ? (
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {formatAmount(data.totalNacho)} NACHO
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">--</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 