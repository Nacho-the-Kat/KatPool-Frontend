import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface WorkerBalances {
  [key: string]: string
}

interface WalletBalances {
  [key: string]: WorkerBalances
}

interface NachoBalanceResponse {
  balance: WalletBalances
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ 
      status: 'error', 
      error: 'Wallet address is required' 
    })
  }

  try {
    const response = await fetch('http://kas.katpool.xyz:8080/nacho_balance')
    const data: NachoBalanceResponse = await response.json()

    // Find the wallet's worker balances
    const walletBalances = data.balance[wallet] || {}

    // Sum all worker balances (converting strings to BigInt to maintain precision)
    const totalSompi = Object.values(walletBalances).reduce((sum, balance) => {
      return sum + BigInt(balance || '0')
    }, BigInt(0))

    return NextResponse.json({
      status: 'success',
      data: {
        sompi: totalSompi.toString(),
        // We'll do the KAS conversion in the frontend to maintain precision
      }
    })
  } catch (error) {
    console.error('Error fetching NACHO rebate balance:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Failed to fetch NACHO rebate balance'
    })
  }
} 