import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get('jwt')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error('BACKEND_URL environment variable is not set');
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(jwt, secret);

      // If JWT is valid, proceed with getting user info
      const response = await fetch(`${backendUrl}/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      const newResponse = NextResponse.json(data);

      // Forward any new authentication cookies if present
      const backendCookies = response.headers.getSetCookie();
      const requiredCookies = ['jwt', 'refresh_token'];
      
      backendCookies.forEach(cookie => {
        if (requiredCookies.some(name => cookie.includes(name))) {
          newResponse.headers.append('Set-Cookie', cookie);
        }
      });

      return newResponse;

    } catch (error) {
      // If JWT verification fails, try to refresh the token
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${backendUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh token');
          }

          const refreshData = await refreshResponse.json();
          
          // Create a new response with the user data
          const newResponse = NextResponse.json(refreshData.user);
          
          // Forward authentication cookies from the refresh response
          const backendCookies = refreshResponse.headers.getSetCookie();
          const requiredCookies = ['jwt', 'refresh_token'];
          
          backendCookies.forEach(cookie => {
            if (requiredCookies.some(name => cookie.includes(name))) {
              newResponse.headers.append('Set-Cookie', cookie);
            }
          });

          return newResponse;
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
