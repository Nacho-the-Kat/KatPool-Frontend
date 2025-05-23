import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const cookieStore = cookies();
    const storedState = cookieStore.get('uphold_state')?.value;

    console.log('storedState:', storedState);
    console.log('state:', state);

    // Verify state and code
    if (!code || !state || state !== storedState) {
      return NextResponse.json(
        { error: 'Invalid state or missing code' },
        { status: 400 }
      );
    }

    // Send request to backend URL
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error('BACKEND_URL environment variable is not set');
    }

    // Send request to backend for authentication
    const response = await fetch(`${backendUrl}/api/uphold/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with backend');
    }

    const data = await response.json();
    
    // Create a new response with the data
    const newResponse = NextResponse.json(data);
    
    // Forward authentication cookies from the backend response
    const backendCookies = response.headers.getSetCookie();
    const requiredCookies = ['jwt', 'refresh_token'];
    
    backendCookies.forEach(cookie => {
      // Only forward authentication-related cookies
      if (requiredCookies.some(name => cookie.includes(name))) {
        newResponse.headers.append('Set-Cookie', cookie);
      }
    });

    // Clear the uphold_state cookie as it's no longer needed
    cookieStore.delete('uphold_state');

    return newResponse;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
