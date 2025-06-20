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
    const response = await fetch(
      `${baseUrl}/api/pool/blockcount24h`,
      {
        headers: {
          'x-trace-id': traceId || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: Number(data.blockCount24h)
      }
    });

  } catch (error) {
    logger.error('Error fetching 24h blocks:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: 0
      }
    });
  }
} 