import { NextResponse } from 'next/server'

// Mock data for asset selections
const mockData = {
  data: [
    { asset: 'BTC', count: 150 },
    { asset: 'ETH', count: 200 },
    { asset: 'KAS', count: 180 },
    { asset: 'NACHO', count: 120 },
    { asset: 'SOL', count: 90 },
    { asset: 'XRP', count: 160 },
    { asset: 'ADA', count: 140 }
  ]
}

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(mockData)
} 