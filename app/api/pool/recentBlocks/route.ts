import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

interface BlockMetric {
  mined_block_hash: string;
  miner_id: string;
  pool_address: string;
  reward_block_hash: string;
  wallet: string;
  daa_score: string;
  miner_reward: string;
  timestamp: string;
}

interface Block {
  blockHash: string;
  daaScore: string;
  timestamp: string;
  miner_reward: number;
  minerId: string;
  poolAddress: string;
  wallet: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');

    const response = await fetch(
      `http://kas.katpool.xyz:8080/api/pool/blockdetails?currentPage=${page}&perPage=${perPage}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    // Transform the blocks data to match the expected format
    const blocks: Block[] = data.data.map((block: BlockMetric) => {
      return {
        blockHash: block.mined_block_hash,
        daaScore: block.daa_score,
        miner_reward: Number(block.miner_reward) / 100000000, // Convert from Sompi to KAS
        timestamp: block.timestamp,
        minerId: block.miner_id,
        poolAddress: block.pool_address,
        reward_block_hash: block.reward_block_hash,
        wallet: block.wallet
      };
    });

    // Sort by timestamp (newest first)
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
        blocks,
        pagination: data.pagination
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