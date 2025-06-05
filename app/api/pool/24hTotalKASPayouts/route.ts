import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {
    const headersList = headers();
    const requestId = headersList.get('x-request-id');
    
    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const response = await fetch(`${baseUrl}/api/pool/24hTotalKASPayouts`, {
      headers: {
        'x-request-id': requestId || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const totalKASPayouts = await response.text(); // Get the actual value

    return NextResponse.json({
      status: 'success',
      data: {
        totalKASPayouts: Number(totalKASPayouts)
      }
    });

  } catch (error) {
    console.error('Error fetching 24h total KAS payouts:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch 24h total KAS payouts',
      data: {
        totalKASPayouts: 0
      }
    }, { status: 500 });
  }
}
