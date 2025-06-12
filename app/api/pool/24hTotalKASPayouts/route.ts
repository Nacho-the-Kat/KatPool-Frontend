import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;
  
  try {
    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const response = await fetch(`${baseUrl}/api/pool/24hTotalKASPayouts`, {
      headers: {
        'x-trace-id': traceId || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const totalKASPayouts = await response.text(); // Get the actual value

    return NextResponse.json({
      status: 'success',
      data: {
        totalKASPayouts: Number(totalKASPayouts)
      }
    });

  } catch (error) {
    logger.error('Error fetching 24h total KAS payouts:', { error, traceId });
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch 24h total KAS payouts',
      data: {
        totalKASPayouts: 0
      }
    }, { status: 500 });
  }
}
