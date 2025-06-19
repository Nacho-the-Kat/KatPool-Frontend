import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import logger from '@/lib/utils/logger';

export const runtime = 'edge';
export const revalidate = 300; // Refresh config every 5 minutes

interface PoolConfig {
  thresholdAmount: string;
  nachoThresholdAmount: string;
  payoutCronSchedule: string;
  [key: string]: any; // Allow other properties
}

export async function GET() {
  const headersList = headers();
  const traceId = headersList.get('x-trace-id') || 'unknown';

  try {
    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const response = await fetch(`${baseUrl}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PoolConfig = await response.json();

    if (!data?.thresholdAmount || !data?.nachoThresholdAmount || !data?.payoutCronSchedule) {
      throw new Error('Invalid response format - missing required fields');
    }

    // Convert threshold amounts from satoshis to KAS/NACHO (divide by 1e8)
    const kasThreshold = Number(data.thresholdAmount) / 1e8;
    const nachoThreshold = Number(data.nachoThresholdAmount) / 1e8;

    // Parse cron schedule to human readable format
    const payoutSchedule = parseCronSchedule(data.payoutCronSchedule);

    return NextResponse.json({
      status: 'success',
      data: {
        kasThreshold: `${kasThreshold.toLocaleString('en-US', { maximumFractionDigits: 2 })} KAS`,
        nachThreshold: `${nachoThreshold.toLocaleString('en-US', { maximumFractionDigits: 2 })} NACHO`,
        payoutSchedule: payoutSchedule
      }
    });
  } catch (error) {
    logger.error('Error fetching pool config:', { error: error instanceof Error ? error.message : String(error), traceId });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pool config' },
      { status: 500 }
    );
  }
}

function parseCronSchedule(cronExpression: string): string {
  // Parse cron expression "0 */12 * * *" (minute hour day month weekday)
  const parts = cronExpression.split(' ');
  
  if (parts.length !== 5) {
    return 'Unknown schedule';
  }

  const [minute, hour, day, month, weekday] = parts;

  // Handle common patterns
  if (hour === '*/12') {
    return 'Every 12 hours';
  } else if (hour === '*/6') {
    return 'Every 6 hours';
  } else if (hour === '*/24' || hour === '0') {
    return 'Daily';
  } else if (hour === '*/2') {
    return 'Every 2 hours';
  } else if (hour === '*/4') {
    return 'Every 4 hours';
  } else if (hour === '*/8') {
    return 'Every 8 hours';
  } else {
    // For specific hours, show the schedule
    const hours = hour.split(',').map(h => parseInt(h)).filter(h => !isNaN(h));
    if (hours.length === 1) {
      return `Daily at ${hours[0]}:${minute.padStart(2, '0')}`;
    } else if (hours.length > 1) {
      return `Daily at ${hours.join(', ')}:${minute.padStart(2, '0')}`;
    }
  }

  return 'Custom schedule';
} 