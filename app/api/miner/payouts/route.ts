import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes since payments are infrequent

export async function GET(request: Request) {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || 'unknown';

  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');

    if (!wallet) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Wallet address is required' 
        },
        { status: 400 }
      );
    }

    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    // Build URL with pagination parameters
    const url = new URL(`${baseUrl}/api/pool/payouts/${wallet}`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('perPage', perPage.toString());
    // Fetch unified payments endpoint
    const response = await fetch(url.toString(), {
      headers: {
        'x-trace-id': traceId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      status: 'success',
      data
    });
  } catch (error) {
    logger.error('Error fetching payments:', { 
      error: error instanceof Error ? error.message : String(error), 
      traceId,
      wallet: new URL(request.url).searchParams.get('wallet')
    });
    
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch payments' 
      },
      { status: 500 }
    );
  }
} 