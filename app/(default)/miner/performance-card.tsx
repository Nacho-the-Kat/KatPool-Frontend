'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import LineChart03 from '@/components/charts/line-chart-03'
import TimeRangeMenu from '@/components/elements/time-range-menu'
import { chartAreaGradient } from '@/components/charts/chartjs-config'
import { tailwindConfig, hexToRGB, formatHashrate, formatHashrateCompact } from '@/components/utils/utils'
import { $fetch } from 'ofetch'

interface HashRateData {
  timestamp: number;
  value: number;
}

export default function AnalyticsCard01() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '180d' | '365d'>('7d')
  const [currentHashrate, setCurrentHashrate] = useState<string>('')
  const [oneHourAvg, setOneHourAvg] = useState<string>('')
  const [twelveHourAvg, setTwelveHourAvg] = useState<string>('')
  const [twentyFourHourAvg, setTwentyFourHourAvg] = useState<string>('')
  const [fortyEightHourAvg, setFortyEightHourAvg] = useState<string>('')
  const [chartData, setChartData] = useState<any>(null)

  const handleRangeChange = (range: '7d' | '30d' | '90d' | '180d' | '365d') => {
    setTimeRange(range);
  };

  // TODO: keep in mind "ignoring any extreme outliers", current implementation is not doing that
  // TODO: "ignoring any extreme outliers" inside the workerHashrate endpoint
  // const calculateTimeRangeAverage = (values: HashRateData[], hoursAgo: number): number => {
  //   const cutoffTime = Date.now() / 1000 - (hoursAgo * 3600);
    
  //   // Get all values within the time range
  //   const relevantValues = values.filter(v => v.timestamp >= cutoffTime && v.value >= 0);
  //   if (relevantValues.length === 0) return 0;

  //   // Calculate average, ignoring any extreme outliers (values more than 3 standard deviations from mean)
  //   const mean = relevantValues.reduce((acc, val) => acc + val.value, 0) / relevantValues.length;
  //   const stdDev = Math.sqrt(
  //     relevantValues.reduce((acc, val) => acc + Math.pow(val.value - mean, 2), 0) / relevantValues.length
  //   );
  //   const validValues = relevantValues.filter(v => 
  //     Math.abs(v.value - mean) <= 3 * stdDev && v.value > 0
  //   );

  //   return relevantValues.length > 0
  //     ? relevantValues.reduce((acc, val) => acc + val.value, 0) / relevantValues.length
  //     : 0;
  // };

  const fetchData = async () => {
    if (!walletAddress) return;
    
    try {
      setIsLoading(true);

      const [minerHashrateResponse, currentResponse, chartResponse, workerHashrateResponse] = await Promise.all([
        $fetch(`/api/miner/averages?wallet=${walletAddress}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        }),
        $fetch(`/api/miner/currentHashrate?wallet=${walletAddress}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        }),
        $fetch(`/api/miner/hashrate?wallet=${walletAddress}&range=${timeRange}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        }),
        $fetch(`/api/miner/workerHashrate?wallet=${walletAddress}`, {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        }),
      ]);

      // Sum up all time period values from all workers
      const totals = {
        fiveMin: 0,
        fifteenMin: 0,
        oneHour: 0,
        twelveHour: 0,
        twentyFourHour: 0,
        fortyEightHour: 0,
      };

      if (workerHashrateResponse?.data?.result) {
        // Loop through each worker and sum their values
        workerHashrateResponse.data.result.forEach((worker: any) => {
          if (worker.averages.fiveMin) totals.fiveMin += worker.averages.fiveMin;
          if (worker.averages.fifteenMin) totals.fifteenMin += worker.averages.fifteenMin;
          if (worker.averages.oneHour) totals.oneHour += worker.averages.oneHour;
          if (worker.averages.twelveHour) totals.twelveHour += worker.averages.twelveHour;
          if (worker.averages.twentyFourHour) totals.twentyFourHour += worker.averages.twentyFourHour;
          if (worker.averages.fortyEightHour) totals.fortyEightHour += worker.averages.fortyEightHour;
        });
      }

      // Handle current hashrate
      if (!currentResponse || currentResponse.error) {
        throw new Error(currentResponse?.error || 'Failed to fetch current hashrate');
      }

      if (currentResponse.status === 'success' && currentResponse.data?.result?.[0]?.value) {
        const [timestamp, value] = currentResponse.data.result[0].value;
        const currentValue = Number(value);
        setCurrentHashrate(formatHashrateCompact(currentValue));
      } else {
        setCurrentHashrate('0 H/s');
      }

      // Calculate averages for different time periods
      setOneHourAvg(formatHashrate(minerHashrateResponse.data['1h']));
      setTwelveHourAvg(formatHashrate(minerHashrateResponse.data['5min']));
      setTwentyFourHourAvg(formatHashrate(minerHashrateResponse.data['24h']));
      setFortyEightHourAvg(formatHashrate(minerHashrateResponse.data['48h']));

      // Handle chart data
      if (!chartResponse || chartResponse.error) {
        throw new Error(chartResponse?.error || 'Failed to fetch data');
      }

      if (!chartResponse.status || chartResponse.status !== 'success') {
        throw new Error('Invalid response status');
      }

      // Generate default data points for the selected time range
      const now = Math.floor(Date.now() / 1000);
      let duration: number;
      switch (timeRange) {
        case '7d': duration = 7 * 24 * 60 * 60; break;
        case '30d': duration = 30 * 24 * 60 * 60; break;
        case '90d': duration = 90 * 24 * 60 * 60; break;
        case '180d': duration = 180 * 24 * 60 * 60; break;
        case '365d': duration = 365 * 24 * 60 * 60; break;
        default: duration = 7 * 24 * 60 * 60;
      }
      const start = now - duration;
      const step = Math.max(Math.floor(duration / 100), 300); // At least 5 minutes between points, max 100 points

      // Create array of timestamps
      const defaultTimestamps = [];
      for (let t = start; t <= now; t += step) {
        defaultTimestamps.push(t);
      }

      // Parse the chart data, or use zeros if no data
      let chartValues: HashRateData[] = [];
      
      if (chartResponse.data?.result?.[0]?.values && Array.isArray(chartResponse.data.result[0].values)) {
        chartValues = chartResponse.data.result[0].values
          .map(([timestamp, value]: [number, string]) => ({
            timestamp,
            value: Number(value)
          }))
          .sort((a: HashRateData, b: HashRateData) => a.timestamp - b.timestamp);
      }

      // If no data, use default timestamps with zero values
      if (chartValues.length === 0) {
        chartValues = defaultTimestamps.map(timestamp => ({
          timestamp,
          value: 0
        }));
      }

      // Update chart data
      setChartData({
        labels: chartValues.map(d => d.timestamp * 1000),
        datasets: [
          {
            data: chartValues.map(d => ({
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
      console.error('Error fetching miner hashrate:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [walletAddress, timeRange]);

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'X',
          unit: 'hour',
          stepSize: 0.5, // 30-minute steps
          displayFormats: {
            hour: 'MMM D, HH:mm'
          }
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false // Hide x-axis labels
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#e2e8f0' // slate-200
        },
        border: {
          display: false,
        },
        ticks: {
          callback: (value: number) => formatHashrate(value),
          color: '#64748b', // slate-500
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return new Date(context[0].parsed.x).toLocaleString();
          },
          label: (context: any) => {
            return `Hashrate: ${formatHashrate(context.parsed.y)}`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (
    <div className="relative flex flex-col col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      {/* Blur overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Enter a wallet address to view analytics
          </div>
        </div>
      )}

      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Miner Performance</h2>
        <TimeRangeMenu align="right" currentRange={timeRange} onRangeChange={handleRangeChange} />
      </header>
      <div className="px-5 py-1">
        <div className="flex flex-wrap max-sm:*:w-1/2">
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mr-2">{currentHashrate}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 5m Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mr-2">{oneHourAvg}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 1h Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mr-2">{twelveHourAvg}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 12h Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mr-2">{twentyFourHourAvg}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 24h Avg</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mr-5" aria-hidden="true"></div>
          </div>
          <div className="flex items-center py-2">
            <div className="mr-5">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mr-2">{fortyEightHourAvg}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last 48h Avg</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] text-red-500">{error}</div>
        ) : chartData && (
          <LineChart03 
            data={chartData} 
            width={800} 
            height={300} 
            options={chartOptions} 
          />
        )}
      </div>
    </div>
  )
}
