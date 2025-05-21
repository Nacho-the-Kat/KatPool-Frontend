import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const revalidate = 10;

export async function GET() {
  try {

    const response = await fetch('http://kas.katpool.xyz:8080/api/pool/24hTotalKASPayouts');

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
