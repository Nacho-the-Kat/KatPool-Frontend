import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10; // Revalidate every 10 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Calculate timestamps for last 12 hours with 1-minute precision
    const end = Math.floor(Date.now() / 1000);
    const start = end - (12 * 60 * 60); // 12 hours ago
    const step = 60; // 1 minute in seconds

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query_range');
    
    // Construct and encode the full query parameter
    const queryString = `added_miner_shares_1min_count{wallet_address="${wallet}"}`;
    url.searchParams.append('query', queryString);
    url.searchParams.append('start', start.toString());
    url.searchParams.append('end', end.toString());
    url.searchParams.append('step', step.toString());

    const response = await fetch(url, {
      next: { revalidate: 10 } // Cache for 10 seconds
    });

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString()
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process the data to get the last share time for each miner
    if (data.status === 'success' && data.data?.result) {
      const results = data.data.result;
      const processedResults = results.map((result: any) => {
        const values = result.values;
        let lastShareTimestamp = null;
        let lastShareValue = '0';

        // Go through values from newest to oldest
        for (let i = values.length - 1; i > 0; i--) {
          const currentValue = Number(values[i][1]);
          const previousValue = Number(values[i - 1][1]);
          
          // If we find a point where the value increased, this is our last share
          if (currentValue > previousValue) {
            lastShareTimestamp = values[i][0];
            lastShareValue = values[i][1];
            break;
          }
        }

        // If we didn't find any increases in the last 12 hours
        if (lastShareTimestamp === null) {
          lastShareTimestamp = end - (12 * 60 * 60); // 12 hours ago
          lastShareValue = values[values.length - 1][1]; // Use the latest value for total shares
        }

        return {
          ...result,
          values: [[lastShareTimestamp, lastShareValue]]
        };
      });

      return NextResponse.json({
        status: 'success',
        data: {
          result: processedResults
        }
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in miner shares API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner shares' },
      { status: 500 }
    );
  }
} 