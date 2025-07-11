'use client'

import { useEffect, useState } from 'react'
import { $fetch } from 'ofetch'
import { formatDistanceToNow } from 'date-fns'

interface Block {
  blockHash: string;
  daaScore: string;
  timestamp: string;
  miner_reward?: number;
  reward_block_hash: string;
}

interface Payout {
  wallet_address: string;
  nacho_amount?: number;
  amount?: number;
  timestamp: string;
  transaction_hash: string;
  payment_type: 'KAS' | 'NACHO';
}

interface AggregatedPayout {
  amount: number;
  timestamp: number;
  transactionHash: string;
}

const Statistics = () => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [payouts, setPayouts] = useState<AggregatedPayout[]>([])
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(true)
  const [isLoadingPayouts, setIsLoadingPayouts] = useState(true)
  const [errorBlocks, setErrorBlocks] = useState<string | null>(null)
  const [errorPayouts, setErrorPayouts] = useState<string | null>(null)

  // Fetch recent blocks
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setIsLoadingBlocks(true);
        const response = await $fetch('/api/pool/recentBlocks?page=1&perPage=10', {
          retry: 3,
          retryDelay: 1000,
          timeout: 10000,
        });

        if (!response || response.error) {
          throw new Error(response?.error || 'Failed to fetch blocks');
        }
        
        // Filter out blocks with no reward_block_hash and limit to 4
        const blocksWithRewardBlockHash = response.data.blocks.filter((block: Block) => block.reward_block_hash);
        setBlocks([...blocksWithRewardBlockHash.slice(0, 4)]);
        setErrorBlocks(null);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setErrorBlocks(error instanceof Error ? error.message : 'Failed to load blocks');
      } finally {
        setIsLoadingBlocks(false);
      }
    };

    fetchBlocks();
    // Refresh every 10 minutes
    const interval = setInterval(fetchBlocks, 600000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent payouts
  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setErrorPayouts(null);
        const response = await $fetch('/api/pool/payouts?page=1&perPage=100');
        
        if (response.status === 'success') {
          const payoutsData = Array.isArray(response.data) ? response.data : response.data?.payouts || response.data?.data || response.data;
          
          if (!Array.isArray(payoutsData)) {
            setErrorPayouts('Invalid data format received');
            return;
          }
          
          // Filter for KAS payouts only
          const kasPayouts = payoutsData.filter((payout: Payout) => payout.amount && payout.amount > 0);
          
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
              const amount = payout.amount ? payout.amount : 0;
              acc[payout.transaction_hash].amount += amount;
              return acc;
            }, {})
          ) as AggregatedPayout[];
          
          // Limit to 4 most recent payouts
          setPayouts(aggregated.slice(0, 4));
        } else {
          setErrorPayouts('Failed to fetch pool payouts');
        }
      } catch (error) {
        console.error('Error fetching pool payouts:', error);
        setErrorPayouts(error instanceof Error ? error.message : 'Failed to load pool payouts');
      } finally {
        setIsLoadingPayouts(false);
      }
    };

    fetchPayouts();
  }, []);

  // Helper functions
  const formatBlockHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const formatAmount = (amount: number) => {
    const kasAmount = amount / 100000000;
    return kasAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 3)}...${hash.slice(-3)}`;
  };

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  // Use payouts directly since they're already limited to 4
  const recentPayouts = payouts;

  return (
    <section id="statistics" className="py-20 relative overflow-hidden section-transition">
      {/* Section-specific overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 via-transparent to-slate-900/10 overlay-transition"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Join the Kat Pool
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
            Industry - leading performance
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-transition">
            Experience Kaspa mining optimization at its finest. Kat Pool delivers industry-leading efficiency, transparent rewards, and innovative dual-mining-like capabilities through our advanced pool infrastructure.
          </p>
        </div>

        {/* Performance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blocks */}
          <div className="bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Recent Found Blocks</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-teal-400 text-sm font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {isLoadingBlocks ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-pulse text-gray-400">Loading blocks...</div>
                </div>
              ) : errorBlocks || blocks.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  {errorBlocks || 'No blocks found'}
                </div>
              ) : (
                blocks.map((block, index) => (
                  <div key={block.blockHash} className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-800/30 rounded-lg px-4 transition-colors duration-200 bg-transition">
                    <div className="flex flex-col">
                      <div className="text-white font-semibold">
                        <a 
                          href={`https://explorer.kaspa.org/blocks/${block.blockHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-teal-400 transition-colors"
                        >
                          {formatBlockHash(block.blockHash)}
                        </a>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatDistanceToNow(new Date(block.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-400 font-semibold">
                        {block.miner_reward ? `${block.miner_reward.toFixed(2)} KAS` : 'N/A'}
                      </div>
                      <div className="text-gray-500 text-sm">DAA: {block.daaScore}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Pool Payouts */}
          <div className="bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Recent Pool Payouts</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-teal-400 text-sm font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {isLoadingPayouts ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-pulse text-gray-400">Loading payouts...</div>
                </div>
              ) : errorPayouts || recentPayouts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  {errorPayouts || 'No payouts found'}
                </div>
              ) : (
                recentPayouts.map((payout, index) => (
                  <div key={payout.transactionHash} className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-800/30 rounded-lg px-4 transition-colors duration-200 bg-transition">
                    <div className="flex flex-col">
                      <div className="text-white font-semibold">
                        <a
                          href={`https://explorer.kaspa.org/txs/${payout.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-teal-400 transition-colors"
                        >
                          {formatTxHash(payout.transactionHash)}
                        </a>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {getRelativeTime(payout.timestamp)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-400 font-semibold">
                        {formatAmount(payout.amount)} KAS
                      </div>
                      <div className="text-green-400 text-sm font-medium">completed</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics; 