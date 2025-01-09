'use client'

import { useState, useEffect } from 'react'
import TimeRangeMenu from '@/components/elements/time-range-menu'
import LineChart01 from '@/components/charts/line-chart-01'
import { chartAreaGradient } from '@/components/charts/chartjs-config'
import { tailwindConfig, hexToRGB } from '@/components/utils/utils'
import { $fetch } from 'ofetch'

interface MinersData {
  timestamp: number;
  value: number;
}

export default function PoolMinersOverTime() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '180d'>('30d');
  const [currentMiners, setCurrentMiners] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);

  const menuItems = [
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 3 Months', value: '90d' },
    { label: 'Last 6 Months', value: '180d' },
  ];

  const fetchData = async (range: string) => {
    try {
      setIsLoading(true);
      const data = await $fetch(`/api/pool/miners/history?range=${range}`, {
        retry: 1,
        timeout: 10000,
      });

      if (data.status !== 'success' || !data.data?.result) {
        throw new Error('Invalid response format');
      }

      // Process the data to get unique miners count over time
      const timePoints = new Map<number, Set<string>>();
      
      data.data.result.forEach((result: any) => {
        const walletAddress = result.metric.wallet_address;
        result.values.forEach(([timestamp, value]: [number, string]) => {
          if (Number(value) > 0) {
            if (!timePoints.has(timestamp)) {
              timePoints.set(timestamp, new Set());
            }
            timePoints.get(timestamp)?.add(walletAddress);
          }
        });
      });

      // Convert to array and sort by timestamp
      const values: MinersData[] = Array.from(timePoints.entries())
        .map(([timestamp, miners]) => ({
          timestamp,
          value: miners.size
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      if (values.length === 0) {
        throw new Error('No data points available');
      }

      // Set current miners count (most recent value)
      const lastValue = values[values.length - 1];
      setCurrentMiners(lastValue.value.toString());

      // Update chart data
      setChartData({
        labels: values.map(d => d.timestamp * 1000),
        datasets: [
          {
            data: values.map(d => ({
              x: d.timestamp * 1000,
              y: d.value
            })),
            fill: true,
            backgroundColor: function(context: any) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              const gradientOrColor = chartAreaGradient(ctx, chartArea, [
                { stop: 0, color: `rgba(${hexToRGB(tailwindConfig.theme.colors.primary[500])}, 0)` },
                { stop: 1, color: `rgba(${hexToRGB(tailwindConfig.theme.colors.primary[500])}, 0.2)` }
              ]);
              return gradientOrColor || 'transparent';
            },
            borderColor: tailwindConfig.theme.colors.primary[500],
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: tailwindConfig.theme.colors.primary[500],
            pointHoverBackgroundColor: tailwindConfig.theme.colors.primary[500],
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            clip: 20,
            tension: 0.2,
          }
        ],
      });

      setError(null);
    } catch (error) {
      console.error('Error fetching miners history:', error);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const handleRangeChange = (range: '7d' | '30d' | '90d' | '180d') => {
    setTimeRange(range);
  };

  if (error) {
    return (
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Pool Miners over Time</h2>
          <TimeRangeMenu align="right" onRangeChange={handleRangeChange} />
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Current Active Miners</div>
        <div className="flex items-start">
          {isLoading ? (
            <div className="h-8 w-28 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded"></div>
          ) : (
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{currentMiners}</div>
          )}
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : chartData && (
          <LineChart01 
            data={chartData} 
            width={389} 
            height={128} 
            tooltipFormatter={(value: number) => value.toString()}
            tooltipTitleFormatter={(timestamp: string) => new Date(timestamp).toLocaleString()}
          />
        )}
      </div>
    </div>
  );
}
