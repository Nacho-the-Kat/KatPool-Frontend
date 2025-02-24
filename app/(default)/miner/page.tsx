export const metadata = {
  title: 'Dashboard - Kat Pool',
  description: 'Where Kaspa Miners Thrive',
}

import { Suspense } from 'react'
import PerformanceCard from './performance-card'
import RewardsCard from './rewards-card'
import SharesCard from './shares-card'
import EarningsCard from './earnings-card'
import WorkersCard from './workers-card'
import WalletCard from './wallet-card'
import { NachoPriceProvider } from './nacho-price-context'

export default function MinerDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
        </div>
        <div className="w-full sm:w-[30%] md:w-[40%] lg:w-[50%]">
          <WalletCard />
        </div>
      </div>

      <NachoPriceProvider>
        <div className="grid grid-cols-12 gap-6">
          <Suspense fallback={<div className="col-span-full xl:col-span-8 bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px] animate-pulse"/>}>
            <PerformanceCard />
          </Suspense>
          <Suspense fallback={<div className="col-span-full xl:col-span-4 bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px] animate-pulse"/>}>
            <RewardsCard />
          </Suspense>
          <Suspense fallback={<div className="col-span-full sm:col-span-6 bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px] animate-pulse"/>}>
            <EarningsCard />
          </Suspense>
          <Suspense fallback={<div className="col-span-full sm:col-span-6 bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px] animate-pulse"/>}>
            <SharesCard />
          </Suspense>
          <Suspense fallback={<div className="col-span-full bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px] animate-pulse"/>}>
            <WorkersCard />
          </Suspense>
        </div>
      </NachoPriceProvider>
    </div>
  )
}
