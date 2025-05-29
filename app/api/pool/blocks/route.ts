import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const response = await fetch(
      'http://kas.katpool.xyz:8080/api/pool/blockdetails?currentPage=1&perPage=10'
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
      });
    }

    throw new Error('Invalid response format');

  } catch (error) {
    console.error('Error fetching total blocks:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch total blocks' },
      { status: 500 }
    );
  }
} 