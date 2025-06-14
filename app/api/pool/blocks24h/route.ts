import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';
export const revalidate = 10;

interface BlockData {
  block_hash: string;
  [key: string]: string; // For the dynamic DAA score key and timestamp
}

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || undefined;
  
  try {
    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const response = await fetch(
      `${baseUrl}/api/pool/blockdetails?currentPage=1&perPage=1000`,
      {
        headers: {
          'x-trace-id': traceId || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json().then(data => data.data);
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

    // Count blocks with timestamps in the last 24 hours
    const blocks24h = data.reduce((count: number, block: BlockData) => {
      const blockTimestamp = new Date(block.timestamp).getTime();
      return blockTimestamp >= twentyFourHoursAgo ? count + 1 : count;
    }, 0);

    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: blocks24h
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