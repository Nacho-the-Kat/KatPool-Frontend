import { NextResponse } from 'next/server'
import logger from '@/lib/utils/logger'

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ 
      status: 'error', 
      error: 'Wallet address is required' 
    })
  }

  try {
    // Fetch config to get nftAllowedTicks array
    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const configResponse = await fetch(`${baseUrl}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!configResponse.ok) {
      throw new Error(`Config fetch failed! status: ${configResponse.status}`);
    }

    const configData = await configResponse.json();
    const nftAllowedTicks = configData.nftAllowedTicks || [];

    if (!Array.isArray(nftAllowedTicks) || nftAllowedTicks.length === 0) {
      return NextResponse.json({
        status: 'success',
        data: {
          nftCount: 0,
          qualified: false
        }
      });
    }

    // Check each NFT collection
    let totalNftCount = 0;
    let hasAnyNfts = false;

    for (const tick of nftAllowedTicks) {
      try {
        const nftResponse = await fetch(`https://mainnet.krc721.stream/api/v1/krc721/mainnet/address/${wallet}/${tick}`);
        const nftData = await nftResponse.json();
        
        const nftCount = nftData.result?.length || 0;
        totalNftCount += nftCount;
        
        if (nftCount > 0 && tick !== 'KATCLAIM') {
          hasAnyNfts = true;
          break;
        }

        if(nftCount > 0 && tick === 'KATCLAIM') {
          for(const nft of nftData.result) {
            if(nft.tokenId >= 736 && nft.tokenId <= 843) {
              hasAnyNfts = true;
              break;
            }
          }
        }
      } catch (error) {
        logger.error(`Error fetching NFTs for tick ${tick}`, {
          tick,
          wallet,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        nftCount: totalNftCount,
        qualified: hasAnyNfts
      }
    })
  } catch (error) {
    logger.error('Error fetching NFT data', {
      wallet,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({
      status: 'success',
      data: {
        nftCount: 0,
        qualified: false
      }
    })
  }
} 