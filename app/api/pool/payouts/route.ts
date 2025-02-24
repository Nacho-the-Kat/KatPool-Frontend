import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 10;

interface KasPayment {
  wallet_address: string[];
  amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface NachoPayment {
  wallet_address: string[];
  nacho_amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface ProcessedPayment {
  walletAddress: string;
  kasAmount?: string;
  nachoAmount?: string;
  timestamp: number;
  transactionHash: string;
  type: 'kas' | 'nacho';
}

export async function GET(request: Request) {
  try {
    // Fetch both KAS and NACHO payments in parallel
    const [kasResponse, nachoResponse] = await Promise.all([
      fetch('http://kas.katpool.xyz:8080/api/pool/payouts'),
      fetch('http://kas.katpool.xyz:8080/api/pool/nacho_payouts')
    ]);

    if (!kasResponse.ok || !nachoResponse.ok) {
      throw new Error(`HTTP error! KAS status: ${kasResponse.status}, NACHO status: ${nachoResponse.status}`);
    }

    const [kasData, nachoData] = await Promise.all([
      kasResponse.json(),
      nachoResponse.json()
    ]);

    // Process KAS payments
    const processedKasPayments: ProcessedPayment[] = kasData.map((payout: KasPayment) => ({
      walletAddress: payout.wallet_address[0],
      kasAmount: (Number(BigInt(payout.amount)) / 1e8).toFixed(8),
      timestamp: new Date(payout.timestamp).getTime(),
      transactionHash: payout.transaction_hash,
      type: 'kas'
    }));

    // Process NACHO payments
    const processedNachoPayments: ProcessedPayment[] = nachoData.map((payout: NachoPayment) => ({
      walletAddress: payout.wallet_address[0],
      nachoAmount: (Number(BigInt(payout.nacho_amount)) / 1e8).toFixed(8),
      timestamp: new Date(payout.timestamp).getTime(),
      transactionHash: payout.transaction_hash,
      type: 'nacho'
    }));

    // Combine all payments and sort by timestamp
    const allPayments = [...processedKasPayments, ...processedNachoPayments]
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      status: 'success',
      data: allPayments
    });
  } catch (error) {
    console.error('Error fetching pool payouts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pool payouts' },
      { status: 500 }
    );
  }
} 