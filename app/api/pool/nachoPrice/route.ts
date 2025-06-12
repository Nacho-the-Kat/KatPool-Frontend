import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

interface NachoPrice {
  'nacho-the-kat': {
    usd: number;
  };
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
      });
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        await wait(delay * Math.pow(2, i)); // Exponential backoff
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await wait(delay * Math.pow(2, i));
    }
  }
  throw new Error('Max retries reached');
}

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || 'unknown';

  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    
    if (!apiKey) {
      throw new Error('CoinGecko API key not configured');
    }

    const response = await fetchWithRetry(
      'https://pro-api.coingecko.com/api/v3/simple/price?ids=nacho-the-kat&vs_currencies=usd',
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': apiKey
        }
      }
    );

    const data: NachoPrice = await response.json();

    if (!data['nacho-the-kat']?.usd) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      status: 'success',
      data: {
        price: data['nacho-the-kat'].usd
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    logger.error('Error fetching NACHO price:', { error: error instanceof Error ? error.message : String(error), traceId });
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? 
      (error.message.includes('429') ? 'Rate limit exceeded, please try again later' : error.message) 
      : 'Failed to fetch NACHO price';
    
    return NextResponse.json(
      { error: errorMessage },
      { 
        status: error instanceof Error && error.message.includes('429') ? 429 : 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
} 