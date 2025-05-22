import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Uphold OAuth configuration
const UPHOLD_CLIENT_ID = process.env.UPHOLD_CLIENT_ID;
const UPHOLD_AUTH_URL = 'https://sandbox.uphold.com/authorize';

export async function GET() {
  if (!UPHOLD_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Uphold client ID is not configured' },
      { status: 500 }
    );
  }

  // Generate a random state parameter for security
  const state = crypto.randomBytes(16).toString('hex');

  // Store state in cookie
  const cookieStore = cookies();
  cookieStore.set('uphold_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });

  // Construct the authorization URL using string concatenation
  const authorizationUrl = UPHOLD_AUTH_URL + '/'
    + UPHOLD_CLIENT_ID
    + '?scope=user:read'
    + '&state=' + state;
    
  console.log(authorizationUrl);
  console.log('state:', state);
  // Redirect to Uphold's authorization page
  return NextResponse.redirect(authorizationUrl);
} 