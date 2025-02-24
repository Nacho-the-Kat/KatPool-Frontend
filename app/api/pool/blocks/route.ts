import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const response = await fetch(
      `http://kas.katpool.xyz:8080/api/v1/query?query=count(last_over_time(success_blocks_details[10y]))`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    // Process the new response format
    if (data?.status === 'success' && data?.data?.result?.[0]?.value?.[1]) {
      const totalBlocks = parseInt(data.data.result[0].value[1]);
      
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