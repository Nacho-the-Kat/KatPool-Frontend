import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';

export async function GET(request: Request) {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ 
      status: 'error', 
      error: 'Wallet address is required' 
    })
  }

  try {
    const response = await fetch(`https://api.kasplex.org/v1/krc20/address/${wallet}/token/NACHO`, {
      headers: {
        'x-trace-id': traceId || '',
      },
    })
    const data = await response.json()

    return NextResponse.json({
      status: 'success',
      data: {
        balance: data.result?.[0]?.balance || '0',
        qualified: BigInt(data.result?.[0]?.balance || '0') >= BigInt('10000000000000000')
      }
    })
  } catch (error) {
    logger.error('Error fetching NACHO balance:', { error: error instanceof Error ? error.message : String(error), traceId })
    return NextResponse.json({
      status: 'success',
      data: {
        balance: '0',
        qualified: false
      }
    })
  }
} 