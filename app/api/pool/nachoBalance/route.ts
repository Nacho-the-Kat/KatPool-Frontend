import { NextResponse } from 'next/server'

export const runtime = 'edge';

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
    const response = await fetch(url);
    const data = await response.json()

    return NextResponse.json({
      status: 'success',
      data: {
        balance: data.result?.[0]?.balance || '0',
        qualified: BigInt(data.result?.[0]?.balance || '0') >= BigInt('10000000000000000')
      }
    })
  } catch (error) {
    console.error('Error fetching NACHO balance:', error)
    return NextResponse.json({
      status: 'success',
      data: {
        balance: '0',
        qualified: false
      }
    })
  }
} 