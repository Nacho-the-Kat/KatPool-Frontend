'use client'

import { useEffect, useState } from 'react'
import DoughnutChart from '@/components/charts/doughnut-chart'
import FallbackMessage from '@/components/elements/fallback-message'
import { tailwindConfig } from '@/components/utils/utils'

export default function MinerTypes() {
  const [chartData, setChartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pool/minerTypes')
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const data = await response.json()
        console.log('Miner Types API response:', data) // Debug log
        
        if (data.status !== 'success') {
          throw new Error(data.message || 'Invalid response')
        }

        if (!data.data?.labels?.length || !data.data?.values?.length) {
          throw new Error('No miner data available')
        }

        const chartConfig = {
          labels: data.data.labels,
          datasets: [
            {
              label: 'Top Manufacturers',
              data: data.data.values,
              backgroundColor: [
                tailwindConfig.theme.colors.primary[500],
                tailwindConfig.theme.colors.sky[500],
                tailwindConfig.theme.colors.primary[800],
                tailwindConfig.theme.colors.sky[800],
              ],
              hoverBackgroundColor: [
                tailwindConfig.theme.colors.primary[600],
                tailwindConfig.theme.colors.sky[600],
                tailwindConfig.theme.colors.primary[900],
                tailwindConfig.theme.colors.sky[900],
              ],
              borderWidth: 0,
            },
          ],
        }
        
        console.log('Chart configuration:', chartConfig) // Debug log
        setChartData(chartConfig)
        setIsLoading(false)
      } catch (err) {
        console.error('Error in MinerTypes:', err) // Debug log
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 600000) // Refresh every 10 minutes
    return () => clearInterval(interval)
  }, [])

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Miners by Manufacturer</h2>
        </header>
        <div className="flex items-center justify-center h-[260px]">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  // Early return for error state
  if (error) {
    return (
      <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Miners by Manufacturer</h2>
        </header>
        <div className="flex justify-center">
          <FallbackMessage
            title="Unable to load miner data"
            message="Check back soon for updated statistics"
          >
            <DoughnutChart 
              data={{
                labels: ['Bitmain', 'MicroBT', 'Canaan', 'Other'],
                datasets: [{
                  label: 'Top Manufacturers',
                  data: [25, 30, 20, 25],
                  backgroundColor: [
                    tailwindConfig.theme.colors.primary[500],
                    tailwindConfig.theme.colors.sky[500],
                    tailwindConfig.theme.colors.primary[800],
                    tailwindConfig.theme.colors.sky[800],
                  ],
                  hoverBackgroundColor: [
                    tailwindConfig.theme.colors.primary[600],
                    tailwindConfig.theme.colors.sky[600],
                    tailwindConfig.theme.colors.primary[900],
                    tailwindConfig.theme.colors.sky[900],
                  ],
                  borderWidth: 0,
                }]
              }} 
              width={389} 
              height={260} 
            />
          </FallbackMessage>
        </div>
      </div>
    )
  }

  // Only render chart if we have data
  if (!chartData?.datasets?.[0]?.data?.length) {
    return (
      <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Miners by Manufacturer</h2>
        </header>
        <div className="flex justify-center">
          <FallbackMessage
            title="No miner data available"
            message="Check back soon for updated statistics"
          >
            <DoughnutChart 
              data={{
                labels: ['Bitmain', 'MicroBT', 'Canaan', 'Other'],
                datasets: [{
                  label: 'Top Manufacturers',
                  data: [25, 30, 20, 25],
                  backgroundColor: [
                    tailwindConfig.theme.colors.primary[500],
                    tailwindConfig.theme.colors.sky[500],
                    tailwindConfig.theme.colors.primary[800],
                    tailwindConfig.theme.colors.sky[800],
                  ],
                  hoverBackgroundColor: [
                    tailwindConfig.theme.colors.primary[600],
                    tailwindConfig.theme.colors.sky[600],
                    tailwindConfig.theme.colors.primary[900],
                    tailwindConfig.theme.colors.sky[900],
                  ],
                  borderWidth: 0,
                }]
              }} 
              width={389} 
              height={260} 
            />
          </FallbackMessage>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Pool Miners by Manufacturer</h2>
      </header>
      <div className="flex justify-center">
        <DoughnutChart data={chartData} width={389} height={260} />
      </div>
    </div>
  )
}
