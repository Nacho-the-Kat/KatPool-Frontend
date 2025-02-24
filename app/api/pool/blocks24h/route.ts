import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface MetricResult {
  metric: {
    __name__: string;
    block_hash: string;
    daa_score: string;
    exported_job: string;
    instance: string;
    job: string;
    miner_id: string;
    timestamp: string;
    wallet_address: string;
  };
  values: [number, string][];
}

export async function GET() {
  try {
    const response = await fetch(
      `http://kas.katpool.xyz:8080/api/v1/query?query=count(last_over_time(success_blocks_details[1d]))`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Process the new response format
    if (data?.status === 'success' && data?.data?.result?.[0]?.value?.[1]) {
      const blocks24h = parseInt(data.data.result[0].value[1]);
      
      return NextResponse.json({
        status: 'success',
        data: {
          totalBlocks24h: blocks24h
        }
      });
    }

    throw new Error('Invalid response format');

  } catch (error) {
    console.error('Error fetching 24h blocks:', error);
    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: 0
      }
    });
  }
} 