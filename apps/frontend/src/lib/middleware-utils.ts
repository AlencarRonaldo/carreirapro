import { NextRequest, NextResponse } from 'next/server';
import {
  AuthMiddlewareConfig,
  MiddlewareAuthResult,
  TokenValidationResult,
  MiddlewareRequest,
  MiddlewareResponse,
  JWTPayload
} from '@/types/auth';

/**
 * Default middleware configuration
 */
export const DEFAULT_MIDDLEWARE_CONFIG: AuthMiddlewareConfig = {
  protectedRoutes: [
    '/profile',
    '/documents', 
    '/jobs',
    '/applications',
    '/cover-letters',
    '/checkout',
    '/plans',
    '/subscription'
  ],
  publicRoutes: [
    '/',
    '/login'
  ],
  loginPath: '/login',
  redirectAfterLogin: '/',
  tokenCookieName: 'cp_token',
  refreshCookieName: 'cp_refresh'
};

/**
 * Extract and decode JWT payload (server-side safe)
 */
export function decodeJWTPayload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Handle URL-safe base64 properly
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const paddedPayload = normalizedPayload + '='.repeat(4 - (normalizedPayload.length % 4));
    
    const decoded = Buffer.from(paddedPayload, 'base64').toString('utf-8');
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.warn('Failed to decode JWT payload:', error);
    return null;
  }
}

/**
 * Validate JWT token with comprehensive checks
 */
export function validateToken(token: string): TokenValidationResult {
  if (!token || typeof token !== 'string') {
    return {
      isValid: false,
      isExpired: false,
      payload: null,
      error: 'Token is missing or invalid format'
    };
  }

  const payload = decodeJWTPayload(token);
  if (!payload) {
    return {
      isValid: false,
      isExpired: false,
      payload: null,
      error: 'Failed to decode token payload'
    };
  }

  // Check if token has expiration
  if (!payload.exp) {
    return {
      isValid: false,
      isExpired: false,
      payload,
      error: 'Token does not have expiration timestamp'
    };
  }

  // Check expiration with 30 second buffer
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now() + 30000; // 30 second buffer
  const isExpired = currentTime >= expirationTime;

  return {
    isValid: !isExpired,
    isExpired,
    payload,
    error: isExpired ? 'Token has expired' : undefined
  };
}

/**
 * Extract authentication token from request
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // Priority 1: Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Priority 2: Cookie
  const cookieToken = request.cookies.get(DEFAULT_MIDDLEWARE_CONFIG.tokenCookieName)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Priority 3: Query parameter (for special cases like email verification)
  const tokenParam = request.nextUrl.searchParams.get('token');
  if (tokenParam) {
    return tokenParam;
  }

  return null;
}

/**
 * Check if route is protected based on configuration
 */
export function isProtectedRoute(
  pathname: string,
  config: AuthMiddlewareConfig = DEFAULT_MIDDLEWARE_CONFIG
): boolean {
  return config.protectedRoutes.some(route => {
    // Exact match
    if (pathname === route) return true;
    
    // Starts with route path (for nested routes)
    if (pathname.startsWith(`${route}/`)) return true;
    
    return false;
  });
}

/**
 * Check if route is explicitly public
 */
export function isPublicRoute(
  pathname: string,
  config: AuthMiddlewareConfig = DEFAULT_MIDDLEWARE_CONFIG
): boolean {
  return config.publicRoutes.some(route => {
    // Exact match
    if (pathname === route) return true;
    
    // Starts with route path
    if (pathname.startsWith(`${route}/`) && route !== '/') return true;
    
    return false;
  });
}

/**
 * Check if request should be processed by auth middleware
 */
export function shouldProcessRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/manifest')
  ) {
    return false;
  }

  return true;
}

/**
 * Create redirect response with preserved destination
 */
export function createRedirectResponse(
  request: NextRequest,
  destination: string,
  config: AuthMiddlewareConfig = DEFAULT_MIDDLEWARE_CONFIG
): NextResponse {
  const url = new URL(destination, request.url);
  
  // Preserve intended destination for protected routes
  if (isProtectedRoute(request.nextUrl.pathname, config)) {
    url.searchParams.set('redirect', request.nextUrl.pathname);
    
    // Also preserve query parameters from original request
    request.nextUrl.searchParams.forEach((value, key) => {
      if (key !== 'redirect') {
        url.searchParams.set(`original_${key}`, value);
      }
    });
  }
  
  const response = NextResponse.redirect(url);
  
  // Add security headers
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('x-auth-redirect', 'true');
  response.headers.set('x-original-pathname', request.nextUrl.pathname);
  
  return response;
}

/**
 * Create authenticated response with security headers
 */
export function createAuthenticatedResponse(
  request: NextRequest,
  user?: { id: string; email: string }
): NextResponse {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('x-authenticated', 'true');
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-xss-protection', '1; mode=block');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  
  // Add user context headers (non-sensitive data only)
  if (user) {
    response.headers.set('x-user-authenticated', 'true');
    // DO NOT add sensitive user data to headers
  }
  
  return response;
}

/**
 * Create response that clears authentication cookies
 */
export function createLogoutResponse(
  request: NextRequest,
  redirectTo: string = '/',
  config: AuthMiddlewareConfig = DEFAULT_MIDDLEWARE_CONFIG
): NextResponse {
  const response = createRedirectResponse(request, redirectTo, config);
  
  // Clear authentication cookies
  response.cookies.delete(config.tokenCookieName);
  response.cookies.delete(config.refreshCookieName);
  
  // Add logout headers
  response.headers.set('x-auth-logout', 'true');
  response.headers.set('clear-site-data', '"cookies", "storage"');
  
  return response;
}

/**
 * Main authentication check for middleware
 */
export function checkAuthentication(
  request: NextRequest,
  config: AuthMiddlewareConfig = DEFAULT_MIDDLEWARE_CONFIG
): MiddlewareAuthResult {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (isPublicRoute(pathname, config)) {
    return {
      isAuthenticated: false,
      shouldRedirect: false
    };
  }
  
  // Check if route needs protection
  if (!isProtectedRoute(pathname, config)) {
    return {
      isAuthenticated: false,
      shouldRedirect: false
    };
  }
  
  // Extract token
  const token = extractTokenFromRequest(request);
  if (!token) {
    return {
      isAuthenticated: false,
      shouldRedirect: true,
      redirectUrl: config.loginPath,
      error: 'No authentication token found'
    };
  }
  
  // Validate token
  const validation = validateToken(token);
  if (!validation.isValid) {
    return {
      isAuthenticated: false,
      shouldRedirect: true,
      redirectUrl: config.loginPath,
      error: validation.error
    };
  }
  
  return {
    isAuthenticated: true,
    shouldRedirect: false
  };
}

/**
 * Log middleware activity (development only)
 */
export function logMiddlewareActivity(
  action: string,
  pathname: string,
  details?: any
): void {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Auth Middleware: ${action} - ${pathname}`, details ? details : '');
  }
}

/**
 * Rate limiting helper (simple implementation)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean {
  const clientId = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize counter
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Increment counter
  clientData.count++;
  requestCounts.set(clientId, clientData);
  
  return true;
}