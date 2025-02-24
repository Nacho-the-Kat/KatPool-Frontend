import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // 5 minutes since payments are infrequent

interface KasPayment {
  id: number;
  wallet_address: string[];
  amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface NachoPayment {
  id: number;
  wallet_address: string[];
  nacho_amount: string;
  timestamp: string;
  transaction_hash: string;
}

interface ProcessedPayment {
  id: number;
  walletAddress: string;
  kasAmount?: string;  // Amount in KAS
  nachoAmount?: string;  // Amount in NACHO
  timestamp: number;
  transactionHash: string;
  type: 'kas' | 'nacho';
}

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

    // Fetch both KAS and NACHO payments in parallel
    const [kasResponse, nachoResponse] = await Promise.all([
      fetch(`http://kas.katpool.xyz:8080/api/payments/${wallet}`),
      fetch(`http://kas.katpool.xyz:8080/api/nacho_payments/${wallet}`)
    ]);

    if (!kasResponse.ok || !nachoResponse.ok) {
      throw new Error(`HTTP error! KAS status: ${kasResponse.status}, NACHO status: ${nachoResponse.status}`);
    }

    const [kasData, nachoData] = await Promise.all([
      kasResponse.json(),
      nachoResponse.json()
    ]);

    // Process KAS payments
    const processedKasPayments: ProcessedPayment[] = kasData.map((payment: KasPayment) => ({
      id: payment.id,
      walletAddress: payment.wallet_address[0],
      kasAmount: (Number(BigInt(payment.amount)) / 1e8).toFixed(8), // Convert sompi to KAS
      timestamp: new Date(payment.timestamp).getTime(),
      transactionHash: payment.transaction_hash,
      type: 'kas'
    }));

    // Process NACHO payments
    const processedNachoPayments: ProcessedPayment[] = nachoData.map((payment: NachoPayment) => ({
      id: payment.id,
      walletAddress: payment.wallet_address[0],
      nachoAmount: (Number(BigInt(payment.nacho_amount)) / 1e8).toFixed(8), // Convert sompi to NACHO
      timestamp: new Date(payment.timestamp).getTime(),
      transactionHash: payment.transaction_hash,
      type: 'nacho'
    }));

    // Combine and sort all payments by timestamp
    const allPayments = [...processedKasPayments, ...processedNachoPayments]
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      status: 'success',
      data: allPayments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch payments' },
      { status: 500 }
    );
  }
} 