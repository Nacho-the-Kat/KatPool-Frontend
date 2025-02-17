import { NextResponse } from 'next/server'

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
    const response = await fetch(`https://mainnet.krc721.stream/api/v1/krc721/mainnet/address/${wallet}/NACHO`)
    const data = await response.json()

    return NextResponse.json({
      status: 'success',
      data: {
        nftCount: data.result?.length || 0,
        qualified: (data.result?.length || 0) > 0
      }
    })
  } catch (error) {
    console.error('Error fetching NACHO NFTs:', error)
    return NextResponse.json({
      status: 'success',
      data: {
        nftCount: 0,
        qualified: false
      }
    })
  }
} 