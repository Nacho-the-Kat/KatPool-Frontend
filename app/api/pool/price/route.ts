import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 60; // Refresh price every minute

interface KaspaPrice {
  price: number;
}

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || 'unknown';

  try {
    const response = await fetch('https://api.kaspa.org/info/price?stringOnly=false');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.price) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: {
        price: data.price
      }
    });
  } catch (error) {
    logger.error('Error fetching Kaspa price:', { error, traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Kaspa price' },
      { status: 500 }
    );
  }
} 