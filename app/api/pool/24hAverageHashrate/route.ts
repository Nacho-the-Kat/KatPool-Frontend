import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

  try {
    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query')
    url.searchParams.append('query', 'avg_over_time(pool_hash_rate_GHps[24h])')
    
    const response = await fetch(url, {
      headers: {
        'x-trace-id': traceId || '',
      },
    })
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
    logger.error('Error fetching 24h average hashrate:', { error, traceId })
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
