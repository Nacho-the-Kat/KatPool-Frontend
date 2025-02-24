import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface BlockData {
  block_hash: string;
  [key: string]: string; // For the dynamic DAA score key and timestamp
}

export async function GET() {
  try {
    const response = await fetch(
      'http://kas.katpool.xyz:8080/api/pool/miningPoolStats'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data?.blocks || !Array.isArray(data.blocks)) {
      throw new Error('Invalid response format');
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

    // Count blocks with timestamps in the last 24 hours
    const blocks24h = data.blocks.reduce((count: number, block: BlockData) => {
      // Get timestamp from the first non-block_hash entry
      const [[, timestamp]] = Object.entries(block).filter(([key]) => key !== 'block_hash');
      
      // If timestamp is within last 24 hours, increment counter
      if (Number(timestamp) >= twentyFourHoursAgo) {
        return count + 1;
      }
      return count;
    }, 0);

    return NextResponse.json({
      status: 'success',
      data: {
        totalBlocks24h: blocks24h
      }
    });

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