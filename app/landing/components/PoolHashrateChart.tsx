'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const mockLabels = [
  '06-10', '06-16', '06-22', '06-28', '07-04', '07-10'
];
const mockPoolHashrate = [1055, 879, 703, 879, 879, 845];
const mockKasPrice = [0.09, 0.08, 0.06, 0.07, 0.08, 0.081];

const data = {
  labels: mockLabels,
  datasets: [
    {
      label: 'KAS Network Hashrate',
      data: mockPoolHashrate,
      borderColor: 'rgba(56,189,248,1)',
      backgroundColor: 'rgba(56,189,248,0.2)',
      yAxisID: 'y',
      tension: 0.4,
      pointRadius: 2,
    },
    {
      label: 'KAS Price',
      data: mockKasPrice,
      borderColor: 'rgba(253,224,71,1)',
      backgroundColor: 'rgba(253,224,71,0.2)',
      yAxisID: 'y1',
      tension: 0.4,
      pointRadius: 2,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#fff' },
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: { color: '#cbd5e1' },
      grid: { color: 'rgba(20,184,166,0.05)' },
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      title: { display: true, text: 'Ph/s', color: '#38bdf8' },
      ticks: { color: '#38bdf8' },
      grid: { color: 'rgba(20,184,166,0.05)' },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      title: { display: true, text: 'USD', color: '#fde047' },
      ticks: { color: '#fde047' },
      grid: { drawOnChartArea: false },
    },
  },
};

export default function PoolHashrateChart() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 card-hover w-full max-w-2xl mx-auto mb-8">
      <Line data={data} options={options} />
    </div>
  );
} 