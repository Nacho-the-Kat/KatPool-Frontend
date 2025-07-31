"use client"

import { useState, useEffect } from "react";

// Helper for formatting numbers
const formatNumber = (amount: number | null, decimals = 2) => {
  if (amount === null || isNaN(amount)) return "--";
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export default function PoolCalculator() {
  const [hashrate, setHashrate] = useState<string>("1");
  // Remove unit state, always use TH/s
  const [isLoading, setIsLoading] = useState(false);
  const [kasPrice, setKasPrice] = useState<number | null>(null);
  const [nachoPrice, setNachoPrice] = useState<number | null>(null);
  const [estimates, setEstimates] = useState<{
    kas: number;
    nacho: number;
    usd: number;
  } | null>(null);

  // Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const [kasRes, nachoRes] = await Promise.all([
          fetch("/api/pool/price").then((r) => r.json()),
          fetch("/api/pool/nachoPrice").then((r) => r.json()),
        ]);
        setKasPrice(kasRes.data.price);
        setNachoPrice(nachoRes.data.price);
      } catch (e) {
        setKasPrice(null);
        setNachoPrice(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // TODO: should seperate as a common function, used by miner estimates as well
  // Calculate estimates (match earnings-card logic)
  const calculateEstimates = async (hashrateValue: number) => {
    setIsLoading(true);
    try {
      // Convert TH/s to GH/s
      const hashrateGH = hashrateValue * 1000;
      // Fetch pool stats
      const [totalHashrateRes, totalKasPayoutsRes] = await Promise.all([
        fetch("/api/pool/24hAverageHashrate").then((r) => r.json()),
        fetch("/api/pool/24hTotalKASPayouts").then((r) => r.json()),
      ]);
      const totalHashrate = totalHashrateRes.data.totalHashrate;
      const totalKasPayouts24h = totalKasPayoutsRes.data.totalKASPayouts / 1e8;
      // Estimated KAS earned per GH/s per day by Katpool
      const kasPerGhPerDay = totalKasPayouts24h / totalHashrate;
      // Calculate estimated KAS for the hashrate
      const estimatedKas = hashrateGH * kasPerGhPerDay;
      // --- NACHO rebate calculation (match earnings-card) ---
      // Pool fee is 0.75% of KAS earned
      const poolFee = estimatedKas * 0.0075;
      // Standard rebate: 33%
      const rebatePercent = 0.33;
      // KAS value of rebate
      const kasRebate = poolFee * rebatePercent;
      // Account for 10% loss during swap
      const kasAfterSwapLoss = kasRebate * 0.9;
      // Convert KAS rebate to NACHO tokens
      const nacho = nachoPrice && kasPrice && nachoPrice > 0 ? (kasAfterSwapLoss * kasPrice) / nachoPrice : 0;
      // USD value: KAS + NACHO
      const usd = kasPrice && nachoPrice ? (estimatedKas * kasPrice) + (nacho * nachoPrice) : 0;
      setEstimates({ kas: estimatedKas, nacho, usd });
    } catch (e) {
      setEstimates(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle calculate button
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const hashrateNum = parseFloat(hashrate);
    if (!isNaN(hashrateNum) && hashrateNum > 0) {
      calculateEstimates(hashrateNum);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleCalculate}>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <label className="block text-sm text-gray-300 font-medium mr-2">
            Your Hashrate (TH/s):
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={hashrate}
            onChange={(e) => setHashrate(e.target.value)}
            className="flex-grow px-3 py-2 rounded-lg border border-gray-700 bg-slate-900 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter hashrate in TH/s"
            required
          />
          {/* Removed select for unit, always TH/s */}
          <button
            type="submit"
            className="ml-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            disabled={isLoading || !hashrate || isNaN(parseFloat(hashrate)) || parseFloat(hashrate) <= 0}
          >
            {isLoading ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </form>
      <div className="mt-8">
        <div className="w-full max-w-md mx-auto bg-slate-800/80 border border-slate-700/80 rounded-xl shadow px-4 py-4 flex flex-row items-center justify-between gap-2">
          {/* KAS/day */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 mb-1 tracking-wide uppercase whitespace-nowrap">KAS/day</span>
            <span className="text-base md:text-lg font-bold text-slate-100 tracking-tight break-all" style={{fontVariantNumeric:'tabular-nums'}}>{estimates ? formatNumber(estimates.kas, 0) : '--'}</span>
          </div>
          <div className="w-px h-8 bg-slate-700/60 mx-1" />
          {/* NACHO/day */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 mb-1 tracking-wide uppercase whitespace-nowrap">NACHO/day</span>
            <span className="text-base md:text-lg font-bold text-slate-100 tracking-tight break-all" style={{fontVariantNumeric:'tabular-nums'}}>{estimates ? formatNumber(estimates.nacho, 0) : '--'}</span>
          </div>
          <div className="w-px h-8 bg-slate-700/60 mx-1" />
          {/* USD/day */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[10px] text-slate-400 mb-1 tracking-wide uppercase whitespace-nowrap">USD/day</span>
            <span className="text-base md:text-lg font-bold text-green-400 tracking-tight break-all" style={{fontVariantNumeric:'tabular-nums'}}>{estimates ? formatNumber(estimates.usd, 0) : '--'}</span>
          </div>
        </div>
        {!estimates && (
          <div className="text-gray-400 text-center mt-2">Enter your hashrate and click Calculate to see your daily estimate.</div>
        )}
      </div>
    </div>
  );
}
