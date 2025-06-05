import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import logger from '@/lib/utils/logger'
import { v4 as uuidv4 } from 'uuid'

export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const url = request.url
  const method = request.method
  const headers = Object.fromEntries(request.headers)
  const path = request.nextUrl.pathname
  const requestId = uuidv4()
  
  // Set requestId in request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  
  // Log request
  logger.info(`request : ${method} ${path}`, {
    method,
    url,
    headers,
    path,
    requestId,
  })

  try {
    // Continue with the request, passing the modified headers
    const response = await NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    
    const endTime = Date.now()
    const duration = endTime - startTime

    // Set requestId in response headers
    response.headers.set('x-request-id', requestId)

    // Log response
    logger.info(`response: ${method} ${path} - ${response.status}`, {
      status: response.status,
      statusText: response.statusText,
      duration,
      url,
      path,
      requestId,
    })

    return response
  } catch (error) {
    // Log error
    logger.error(`response: ${method} ${path} - Error`, {
      type: 'ERROR',
      url,
      path,
      isApi: path.startsWith('/api'),
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
    })
    throw error
  }
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 