'use client';

import React from 'react';
import { TrendingUp, Server, Clock, DollarSign, Shield, Zap, Users, Award } from 'lucide-react';

const mockStats = {
  poolHashrate: '191.16 Ph/s',
  networkHashrate: '845.89 Ph/s',
  dailyRevenue: '$0.4308 /T',
  payoutScheme: 'KAS 1% CAU 1%',
  algo: 'kHeavyHash',
  mode: 'PPLNS',
  paymentTime: 'Auto-pay at 10:00 ~ 22:00 (twice daily)',
  minAmount: 'Logged-in mining: 15 KAS (can be set)\nAnonymous mining: 30 KAS (Not configurable)\nCAU: 0.1 CAU',
};

const statItems = [
  {
    icon: TrendingUp,
    label: 'Pool Hashrate',
    value: mockStats.poolHashrate,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20'
  },
  {
    icon: Server,
    label: 'Network Hashrate',
    value: mockStats.networkHashrate,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20'
  },
  {
    icon: DollarSign,
    label: 'Daily Revenue',
    value: mockStats.dailyRevenue,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20'
  },
  {
    icon: Shield,
    label: 'Payout Scheme',
    value: mockStats.payoutScheme,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    icon: Zap,
    label: 'Algorithm',
    value: mockStats.algo,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  },
  {
    icon: Award,
    label: 'Mining Mode',
    value: mockStats.mode,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20'
  }
];

export default function PoolStatsCard() {
  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 card-hover w-full max-w-2xl mb-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4 card-hover">
            <Zap className="w-4 h-4 text-teal-400 mr-2" />
            <span className="text-sm font-medium text-teal-300">Pool Statistics</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">KAS+CAU</h2>
          <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
            $0.081262
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {statItems.map((item, index) => (
            <div 
              key={index}
              className="group/item relative p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 bg-slate-800/30 hover:bg-slate-800/50 bg-transition"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${item.bgColor} border ${item.borderColor} flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300 scale-transition`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-400 mb-1">{item.label}</div>
                  <div className="text-white font-semibold">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-300 mb-1">Payment Schedule (UTC+0)</div>
              <div className="text-white text-sm">{mockStats.paymentTime}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-amber-300 mb-2">Minimum Payout Thresholds</div>
                <div className="text-amber-200 text-sm whitespace-pre-line leading-relaxed">
                  {mockStats.minAmount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 