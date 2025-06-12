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
      `${baseUrl}/api/pool/blockdetails?currentPage=1&perPage=10`,
      {
        headers: {
          'x-trace-id': traceId || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json().then(data => data.pagination);

    // Process the new response format
    if (data?.totalCount) {
      const totalBlocks = parseInt(data.totalCount);
      
      return NextResponse.json({
        status: 'success',
        data: {
          totalBlocks: totalBlocks
        }
      }, {
        headers: {
          'x-trace-id': traceId || '',
        },
      });
    }

    throw new Error('Invalid response format');

  } catch (error) {
    logger.error('Error fetching total blocks:', { error, traceId });
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch total blocks' },
      { 
        status: 500,
        headers: {
          'x-trace-id': headers().get('x-trace-id') || '',
        },
      }
    );
  }
} 