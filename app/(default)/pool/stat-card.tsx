'use client'

import { ReactNode, useEffect, useState } from 'react'
import { KaspaAPI } from '@/lib/kaspa/api'
import Image from 'next/image'
import { $fetch } from 'ofetch'
import { formatHashrate } from '@/components/utils/utils'

interface StatCardProps {
  dataType: 'daaScore' | 'supply' | 'difficulty' | 'blockCount' | 'hashrate' | 
            'minedPercent' | 'nextReduction' | 'nextReward' | 'blockReward' | 'totalSupply' | 
            'poolHashrate' | 'poolBlocks' | 'poolMiners' | 'pool24hBlocks' |
            'price' | 'totalPaidKas' | 'totalPaidNacho' | 'kasThreshold' | 'nachThreshold' | 'payoutSchedule' | 'poolLuck'
  label: string
  icon: ReactNode | 'kaspa'
}

export default function StatCard({ dataType, label, icon }: StatCardProps) {
  const [value, setValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = ''
        
        switch (dataType) {
          case 'daaScore':
            const networkInfo = await KaspaAPI.network.getInfo()
            result = Number(networkInfo.virtualDaaScore).toLocaleString('en-US')
            break
          case 'supply':
            const supplyInfo = await KaspaAPI.network.getCoinSupply()
            try {
              const circulatingSupply = BigInt(supplyInfo.circulatingSupply)
              const supplyInBillions = Number(circulatingSupply) / 1e8 / 1e9
              result = `${supplyInBillions.toFixed(4)} B`
            } catch (error) {
              console.error('Supply conversion error:', error)
              result = '--'
            }
            break
          case 'difficulty':
            const difficultyInfo = await KaspaAPI.network.getInfo()
            result = (difficultyInfo.difficulty / 1e12).toFixed(2) + ' T'
            break
          case 'blockCount':
            const blockInfo = await KaspaAPI.network.getInfo()
            result = blockInfo.blockCount.toLocaleString('en-US')
            break
          case 'hashrate':
            const hashrateResponse = await KaspaAPI.network.getHashrate(false)
            const hashrate = Number(hashrateResponse.hashrate) * 1000; // adjust units
            const formattedHashrate = formatHashrate(hashrate)
            result = `${formattedHashrate}`
            break
          case 'minedPercent':
            const supplyData = await KaspaAPI.network.getCoinSupply()
            try {
              const circulatingSupply = BigInt(supplyData.circulatingSupply)
              const maxSupplyKAS = BigInt(28_701_500_000) * BigInt(100_000_000)
              
              if (maxSupplyKAS <= BigInt(0)) {
                throw new Error('Invalid supply values')
              }
              
              const percentage = Number(circulatingSupply * BigInt(10000) / maxSupplyKAS) / 100
              result = `${percentage.toFixed(2)}%`
            } catch (error) {
              console.error('Supply calculation error:', error)
              result = '--'
            }
            break
          case 'nextReduction':
            const halvingInfo = await KaspaAPI.network.getHalvingInfo()
            const now = Math.floor(Date.now() / 1000)
            const timeUntilHalving = halvingInfo.nextHalvingTimestamp - now
            const days = Math.floor(timeUntilHalving / 86400)
            const hours = Math.floor((timeUntilHalving % 86400) / 3600)
            result = `${days}d ${hours}h`
            break
          case 'nextReward':
            const nextRewardInfo = await KaspaAPI.network.getHalvingInfo()
            const nextRewardAmount = Number(nextRewardInfo.nextHalvingAmount)
            result = nextRewardAmount % 1 === 0 
              ? `${nextRewardAmount} KAS` 
              : `${nextRewardAmount.toFixed(2)} KAS`
            break
          case 'blockReward':
            const currentRewardResponse = await KaspaAPI.network.getBlockReward(false)
            const currentReward = Number(currentRewardResponse.blockreward)
            result = currentReward % 1 === 0 
              ? `${currentReward} KAS` 
              : `${currentReward.toFixed(2)} KAS`
            break
          case 'totalSupply':
            const totalSupplyResponse = await KaspaAPI.network.getTotalSupply()
            try {
              const totalInBillions = Number(totalSupplyResponse) / 1e9
              result = `${totalInBillions.toFixed(4)} B`
            } catch (error) {
              console.error('Total Supply conversion error:', error)
              result = '--'
            }
            break
          case 'poolHashrate':
            try {
              const data = await $fetch('/api/pool/hashrate', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.result?.[0]?.value?.[1]) {
                throw new Error('Invalid response format');
              }
              
              const rawHashrate = Number(data.data.result[0].value[1]);
              
              if (!Number.isFinite(rawHashrate)) {
                throw new Error('Invalid hashrate value received');
              }
              
              const formattedResult = formatHashrate(rawHashrate);
              result = formattedResult;
            } catch (error) {
              console.error('Error fetching pool hashrate:', error);
              result = '--';
            }
            break
          case 'poolBlocks':
            try {
              const data = await $fetch('/api/pool/blocks', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.totalBlocks) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.totalBlocks.toLocaleString('en-US');
            } catch (error) {
              console.error('Error fetching pool blocks:', error);
              result = '--';
            }
            break
          case 'poolMiners':
            try {
              const data = await $fetch('/api/pool/minerTypes', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !Array.isArray(data.data?.values)) {
                throw new Error('Invalid response format');
              }
              
              // Sum up all miner counts
              const totalMiners = data.data.values.reduce((sum: number, count: number) => sum + count, 0);
              result = totalMiners.toLocaleString('en-US');
            } catch (error) {
              console.error('Error fetching active miners:', error);
              result = '--';
            }
            break
          case 'pool24hBlocks':
            try {
              const data = await $fetch('/api/pool/blocks24h', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || typeof data.data?.totalBlocks24h !== 'number') {
                throw new Error('Invalid response format');
              }
              
              result = data.data.totalBlocks24h.toLocaleString('en-US');
            } catch (error) {
              console.error('Error fetching 24h blocks:', error);
              result = '--';
            }
            break
          case 'price':
            const priceResponse = await KaspaAPI.network.getPrice(false)
            result = `$${Number(priceResponse.price).toFixed(4)}`
            break
          case 'totalPaidKas':
            try {
              const data = await $fetch('/api/pool/totalPaidKAS', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || typeof data.data?.totalPaidKAS !== 'number') {
                throw new Error('Invalid response format');
              }
              
              // Convert from satoshis to KAS (divide by 1e8) and format
              const kasAmount = data.data.totalPaidKAS / 1e8;
              result = `${kasAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
            } catch (error) {
              console.error('Error fetching total paid KAS:', error);
              result = '--';
            }
            break
          case 'totalPaidNacho':
            try {
              const data = await $fetch('/api/pool/totalPaidNACHO', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || typeof data.data?.totalPaidNACHO !== 'number') {
                throw new Error('Invalid response format');
              }
              
              // Convert from satoshis to NACHO (divide by 1e8) and format
              const nachoAmount = data.data.totalPaidNACHO / 1e8;
              result = `${nachoAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
            } catch (error) {
              console.error('Error fetching total paid NACHO:', error);
              result = '--';
            }
            break
          case 'kasThreshold':
            try {
              const data = await $fetch('/api/pool/config', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.kasThreshold) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.kasThreshold;
            } catch (error) {
              console.error('Error fetching KAS threshold:', error);
              result = '--';
            }
            break
          case 'nachThreshold':
            try {
              const data = await $fetch('/api/pool/config', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.nachThreshold) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.nachThreshold;
            } catch (error) {
              console.error('Error fetching NACHO threshold:', error);
              result = '--';
            }
            break
          case 'payoutSchedule':
            try {
              const data = await $fetch('/api/pool/config', {
                retry: 1,
                timeout: 5000,
              });
              
              if (data.status !== 'success' || !data.data?.payoutSchedule) {
                throw new Error('Invalid response format');
              }
              
              result = data.data.payoutSchedule;
            } catch (error) {
              console.error('Error fetching payout schedule:', error);
              result = '--';
            }
            break
          case 'poolLuck':
            try {
              const poolHashrateData = await $fetch('/api/pool/hashrate', {
                retry: 1,
                timeout: 5000,
              });
              
              if (poolHashrateData.status !== 'success' || !poolHashrateData.data?.result?.[0]?.value?.[1]) {
                throw new Error('Invalid pool hashrate response');
              }
              
              const poolHashrate = Number(poolHashrateData.data.result[0].value[1]);
              
              // Fetch network hashrate
              const networkHashrateResponse = await KaspaAPI.network.getHashrate(false);
              const networkHashrate = Number(networkHashrateResponse.hashrate) * 1000; // adjust units
              
              // Fetch 24h blocks
              const blocks24hData = await $fetch('/api/pool/blocks24h', {
                retry: 1,
                timeout: 5000,
              });
              
              if (blocks24hData.status !== 'success' || typeof blocks24hData.data?.totalBlocks24h !== 'number') {
                throw new Error('Invalid 24h blocks response');
              }
              
              const actualBlocks24h = blocks24hData.data.totalBlocks24h;
              const kaspaBlocksPerDay = 864000; // number of blocks per day in kaspa
              const expected24hBlocks = (poolHashrate / networkHashrate) * kaspaBlocksPerDay;
              // Calculate luck: Expected Blocks / Actual Blocks
              const luckPercentage = ((actualBlocks24h / expected24hBlocks) * 100).toFixed(2);
              result = `${luckPercentage}%`;
            } catch (error) {
              console.error('Error calculating pool luck:', error);
              result = '--';
            }
            break
        }
        
        setValue(result)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setValue('--')
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [dataType])

  return (
    <div className="flex flex-col col-span-full sm:col-span-4 xl:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60">
      <div className="px-5 pt-5 pb-4">
        <header className="flex items-center mb-2">
          <div className="text-primary-500">
            {icon === 'kaspa' ? (
              <Image
                src="/images/kaspa-dark.svg"
                alt="Kaspa Logo"
                width={32}
                height={32}
                className="w-7 h-7"
              />
            ) : (
              icon
            )}
          </div>
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase ml-2">{label}</div>
        </header>
        <div className="flex items-start">
          {isLoading ? (
            <div className="h-8 w-28 bg-gray-100 dark:bg-gray-700/50 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
          )}
        </div>
      </div>
    </div>
  )
} 