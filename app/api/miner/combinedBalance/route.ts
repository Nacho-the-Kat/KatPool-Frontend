import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/utils/logger'

export const runtime = 'edge'
export const revalidate = 10

interface WorkerBalance {
  [key: string]: [string, string] // [KAS balance, NACHO rebate] in sompi
}

interface BalanceResponse {
  balance: {
    [walletAddress: string]: WorkerBalance
  }
}

export async function GET(request: Request) {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;

  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const response = await fetch(`${baseUrl}/balance/${wallet}`, {
      headers: {
        'x-trace-id': traceId || '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: BalanceResponse = await response.json()
    
    // Add validation for the response structure
    if (!data.balance || !data.balance[wallet]) {
      return NextResponse.json({
        status: 'success',
        data: {
          pendingBalance: '0',
          pendingRebate: '0'
        }
      })
    }

    const walletData = data.balance[wallet]

    // Add validation for the worker balance format
    const totals = Object.entries(walletData).reduce(
      (acc, [_, balances]) => {
        // Ensure balances is an array with two valid string numbers
        if (!Array.isArray(balances) || balances.length !== 2 || 
            !balances.every(b => /^\d+$/.test(b || '0'))) {
          return acc
        }
        const [kasBalance, nachoRebate] = balances
        return {
          kasSompi: acc.kasSompi + BigInt(kasBalance || '0'),
          nachoRebateSompi: acc.nachoRebateSompi + BigInt(nachoRebate || '0')
        }
      },
      { kasSompi: BigInt(0), nachoRebateSompi: BigInt(0) }
    )

    return NextResponse.json({
      status: 'success',
      data: {
        pendingBalance: totals.kasSompi.toString(),
        pendingRebate: totals.nachoRebateSompi.toString()
      }
    })

  } catch (error) {
    logger.error('Error fetching combined balance:', { error, traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch balances' },
      { status: 500 }
    )
  }
} 