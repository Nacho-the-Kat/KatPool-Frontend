import { Suspense } from 'react'
import PayoutsCard from './payouts-card'

export const metadata = {
  title: 'Uphold Payouts - Kat Pool',
  description: 'View your Uphold payout history on Kat Pool - Where Kaspa Miners Thrive',
}

export default function UpholdPayouts() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Uphold Payouts</h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-12 gap-6">
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
          <PayoutsCard />
        </Suspense>
      </div>
    </div>
  )
} 