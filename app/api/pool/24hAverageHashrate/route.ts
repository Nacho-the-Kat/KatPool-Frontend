import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query')
    url.searchParams.append('query', 'avg_over_time(pool_hash_rate_GHps[24h])')
    
    const response = await fetch(url)
    const data = await response.json()
    
    const totalHashrate = data.data.result?.[0]?.value?.[1]
    
    if (!totalHashrate) {
      return NextResponse.json(
        { status: 'error', message: 'Failed to fetch hashrate data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'success',
      data: {
        totalHashrate: Number(totalHashrate)
      }
    })
  } catch (error) {
    console.error('Error fetching 24h average hashrate:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
