import { NextRequest, NextResponse } from 'next/server';
import {
  shouldProcessRequest,
  checkAuthentication,
  createRedirectResponse,
  createAuthenticatedResponse,
  createLogoutResponse,
  logMiddlewareActivity,
  checkRateLimit,
  DEFAULT_MIDDLEWARE_CONFIG
} from './src/lib/middleware-utils';
import type { AuthMiddlewareConfig } from './src/types/auth';

// Custom middleware configuration (can be extended as needed)
const MIDDLEWARE_CONFIG: AuthMiddlewareConfig = {
  ...DEFAULT_MIDDLEWARE_CONFIG,
  // Add any custom overrides here if needed
};

/**
 * Main middleware function with comprehensive authentication and security
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();
  
  // Skip processing for static files and API routes
  if (!shouldProcessRequest(request)) {
    return NextResponse.next();
  }

  // Rate limiting check (optional, can be disabled in production if using CDN)
  if (process.env.NODE_ENV === 'production') {
    if (!checkRateLimit(request, 120, 60000)) { // 120 requests per minute
      logMiddlewareActivity('RATE_LIMIT_EXCEEDED', pathname, { ip: request.ip });
      return new NextResponse('Rate limit exceeded', { 
        status: 429,
        headers: { 'retry-after': '60' }
      });
    }
  }

  // Perform authentication check
  const authResult = checkAuthentication(request, MIDDLEWARE_CONFIG);
  
  // Handle unauthenticated requests to protected routes
  if (authResult.shouldRedirect) {
    logMiddlewareActivity('REDIRECT_TO_LOGIN', pathname, {
      reason: authResult.error,
      redirectUrl: authResult.redirectUrl
    });
    
    // Special handling for expired tokens - clear cookies
    if (authResult.error?.includes('expired')) {
      return createLogoutResponse(
        request, 
        authResult.redirectUrl || MIDDLEWARE_CONFIG.loginPath,
        MIDDLEWARE_CONFIG
      );
    }
    
    return createRedirectResponse(
      request, 
      authResult.redirectUrl || MIDDLEWARE_CONFIG.loginPath, 
      MIDDLEWARE_CONFIG
    );
  }

  // Handle authenticated requests
  if (authResult.isAuthenticated) {
    logMiddlewareActivity('ACCESS_GRANTED', pathname, {
      duration: Date.now() - startTime
    });
    
    return createAuthenticatedResponse(request);
  }

  // Allow public routes and non-protected routes
  logMiddlewareActivity('PUBLIC_ACCESS', pathname);
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'
  ]
};