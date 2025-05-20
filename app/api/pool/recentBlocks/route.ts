import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface BlockMetric {
  block_hash: string;
  [key: string]: string; // For the dynamic DAA score key
}

interface Block {
  blockHash: string;
  daaScore: string;
  timestamp: string;
  miner_reward?: string;
}

export async function GET() {
  try {
    const response = await fetch(
      'http://kas.katpool.xyz:8080/api/pool/miningPoolStats'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    if (!data?.blocks || !Array.isArray(data.blocks)) {
      throw new Error('Invalid response format');
    }

    // Transform the blocks data to match the expected format
    const blocks: Block[] = data.blocks.map((block: BlockMetric) => {
      // Extract the DAA score (key) and timestamp (value) from the first entry
      const [[daaScore, timestamp]] = Object.entries(block).filter(([key]) => key !== 'block_hash');
      
      return {
        blockHash: block.block_hash,
        daaScore: daaScore,
        // TODO: remove this once we have the new endpoint
        miner_reward: '0',
        // Convert from milliseconds to ISO string for timestamp
        timestamp: new Date(Number(timestamp)).toISOString()
      };
    });

    // Sort by timestamp (newest first) - maintaining existing sort behavior
    blocks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // const blockdetails = await fetch('http://kas.katpool.xyz:8080/api/pool/blockdetails', {
    //   cache: 'no-store',
    // }).then(res => res.json());
    // const formattedBlocks = blocks.map(block => {
    //   const detail = blockdetails.find(
    //     (elem: { mined_block_hash: string }) => elem.mined_block_hash === block.blockHash
    //   );
    
    //   return {
    //     ...block,
    //     minerReward: detail?.miner_reward ?? '0', // default to '0' if not found
    //   };
    // });

    return NextResponse.json({
      status: 'success',
      data: {
        blocks
      }
    });

  } catch (error) {
    console.error('Error fetching recent blocks:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch recent blocks' },
      { status: 500 }
    );
  }
} 