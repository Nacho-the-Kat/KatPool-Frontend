'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Head from 'next/head'
import PoolPayoutsCard from './poolPayouts-card'

interface Payout {
  id: number
  timestamp: number
  transactionHash: string
  kasAmount?: string
  nachoAmount?: string
  type: 'kas' | 'nacho'
}

// Component that uses useSearchParams - must be wrapped in Suspense
function PoolPayoutsContent() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(500)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize pagination from URL params
  useEffect(() => {
    const queryPage = searchParams.get('page')
    const queryPerPage = searchParams.get('perPage')
    
    // Set pagination from URL params
    if (queryPage) {
      setCurrentPage(parseInt(queryPage))
    }
    if (queryPerPage) {
      setItemsPerPage(parseInt(queryPerPage))
    }
  }, [searchParams])

  // Fetch payouts data
  const fetchPayouts = async (page: number = 1, perPage: number = 500) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString()
      })
      
      const response = await fetch(`/api/pool/payouts?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.status === 'success') {
        // Transform the backend data to match frontend interface
        const transformedPayouts = (result.data.data || []).map((payout: any, index: number) => ({
          id: index + 1, // Generate ID since backend doesn't provide one
          timestamp: new Date(payout.timestamp).getTime(),
          transactionHash: payout.transaction_hash,
          kasAmount: payout.payment_type === 'KAS' ? (Number(BigInt(payout.amount)) / 1e8).toFixed(8) : undefined,
          nachoAmount: payout.payment_type === 'NACHO' ? (Number(BigInt(payout.nacho_amount)) / 1e8).toFixed(8) : undefined,
          type: payout.payment_type === 'KAS' ? 'kas' : 'nacho'
        }))
        
        setPayouts(transformedPayouts)
        setTotalItems(result.data.pagination?.totalCount || 0)
      } else {
        throw new Error(result.error || 'Failed to fetch payouts')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payouts')
      setPayouts([])
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when pagination changes
  useEffect(() => {
    fetchPayouts(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Update URL with new page
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    window.history.replaceState({}, '', url.toString())
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
    // Update URL with new items per page and reset page to 1
    const url = new URL(window.location.href)
    url.searchParams.set('perPage', itemsPerPage.toString())
    url.searchParams.set('page', '1')
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <PoolPayoutsCard 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        onPageChange={handlePageChange} 
        onItemsPerPageChange={handleItemsPerPageChange} 
        totalItems={totalItems} 
        payouts={payouts} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  )
}

export default function PoolPayouts() {
  return (
    <>
      <Head>
        <title>Pool Payouts - Kat Pool</title>
        <meta name="description" content="View all pool payouts on Kat Pool - Where Kaspa Miners Thrive" />
      </Head>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Pool Payout History</h1>
          </div>
        </div>

        {/* Cards */}
        <Suspense fallback={
          <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        }>
          <PoolPayoutsContent />
        </Suspense>
      </div>
    </>
  )
}
