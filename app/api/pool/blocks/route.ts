import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const headersList = headers();
    const requestId = headersList.get('x-request-id');

    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const response = await fetch(
      `${baseUrl}/api/pool/blockdetails?currentPage=1&perPage=10`,
      {
        headers: {
          'x-request-id': requestId || '',
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
          'x-request-id': requestId || '',
        },
      });
    }

    throw new Error('Invalid response format');

  } catch (error) {
    console.error('Error fetching total blocks:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch total blocks' },
      { 
        status: 500,
        headers: {
          'x-request-id': headers().get('x-request-id') || '',
        },
      }
    );
  }
} 