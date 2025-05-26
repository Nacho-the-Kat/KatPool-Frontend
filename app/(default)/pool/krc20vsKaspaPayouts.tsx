'use client'

import { useState, useEffect } from 'react'
import { $fetch } from 'ofetch'
import BarChart03 from '@/components/charts/bar-chart-03'
import { tailwindConfig } from '@/components/utils/utils'

interface AssetSelectionData {
  asset: string
  count: number
}

const COLORS = [
  { bg: tailwindConfig.theme.colors.primary[700], hover: tailwindConfig.theme.colors.primary[800] },
  { bg: tailwindConfig.theme.colors.primary[500], hover: tailwindConfig.theme.colors.primary[600] },
  { bg: tailwindConfig.theme.colors.primary[300], hover: tailwindConfig.theme.colors.primary[400] },
];

export default function KRC20vsKaspaPayouts() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await $fetch('/api/uphold/asset-selections', {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        })

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch data')
        }

        const data: AssetSelectionData[] = response.data

        // Transform data for the chart
        const chartData = {
          labels: data.map(item => item.asset),
          datasets: data.map((item, index) => ({
            label: item.asset,
            data: [item.count],
            backgroundColor: COLORS[index % COLORS.length].bg,
            hoverBackgroundColor: COLORS[index % COLORS.length].hover,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
            borderRadius: 4,
          })),
          options: {
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              }
            },
            scales: {
              x: {
                stacked: false,
                grid: {
                  display: false
                }
              },
              y: {
                stacked: false,
                grid: {
                  display: true
                }
              }
            }
          }
        }

        setChartData(chartData)
        setError(null)
      } catch (error) {
        console.error('Error fetching asset selection data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Asset Selection Distribution</h2>
      </header>

      <div className="grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-[248px]">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[248px] text-red-500">{error}</div>
        ) : chartData ? (
          <BarChart03 data={chartData} width={595} height={248} />
        ) : null}
      </div>
    </div>
  )
}
