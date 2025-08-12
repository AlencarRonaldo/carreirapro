import { AuthTokens, JWTPayload, AuthStatus, RefreshTokenResponse } from '@/types/auth';
import { API_BASE } from './api';

/**
 * Decode JWT token payload without verification (client-side)
 * Note: This is for reading payload only, not for security validation
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  // Add 30 second buffer to account for clock skew
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now() + 30000;
  
  return currentTime >= expirationTime;
}

/**
 * Get tokens from localStorage safely
 */
export function getTokens(): AuthTokens {
  if (typeof window === 'undefined') {
    return { access: null, refresh: null };
  }
  
  try {
    return {
      access: localStorage.getItem('cp_token'),
      refresh: localStorage.getItem('cp_refresh'),
    };
  } catch {
    return { access: null, refresh: null };
  }
}

/**
 * Set tokens in localStorage safely
 */
export function setTokens(access?: string | null, refresh?: string | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (access !== undefined) {
      if (access === null) {
        localStorage.removeItem('cp_token');
      } else {
        localStorage.setItem('cp_token', access);
      }
    }
    
    if (refresh !== undefined) {
      if (refresh === null) {
        localStorage.removeItem('cp_refresh');
      } else {
        localStorage.setItem('cp_refresh', refresh);
      }
    }
  } catch {
    // Handle localStorage errors silently
  }
}

/**
 * Clear all authentication tokens
 */
export function clearTokens(): void {
  setTokens(null, null);
}

/**
 * Check authentication status
 */
export function getAuthStatus(): AuthStatus {
  const tokens = getTokens();
  
  if (!tokens.access) {
    return 'unauthenticated';
  }
  
  if (isTokenExpired(tokens.access)) {
    return tokens.refresh ? 'expired' : 'unauthenticated';
  }
  
  return 'authenticated';
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const { refresh } = getTokens();
    if (!refresh) return null;
    
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    
    if (!response.ok) {
      // If refresh fails, clear tokens
      clearTokens();
      return null;
    }
    
    const data = (await response.json()) as RefreshTokenResponse;
    
    if (data?.accessToken) {
      setTokens(data.accessToken, data.refreshToken || refresh);
      return data.accessToken;
    }
    
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * Get user information from access token
 */
export function getUserFromToken(token?: string): { id: string; email: string } | null {
  const accessToken = token || getTokens().access;
  if (!accessToken) return null;
  
  const payload = decodeJWT(accessToken);
  if (!payload) return null;
  
  return {
    id: payload.sub,
    email: payload.email,
  };
}

/**
 * Check if current user is authenticated with valid token
 */
export async function validateAuthentication(): Promise<boolean> {
  const status = getAuthStatus();
  
  switch (status) {
    case 'authenticated':
      return true;
    case 'expired':
      // Try to refresh token
      const newToken = await refreshAccessToken();
      return newToken !== null;
    default:
      return false;
  }
}

/**
 * Set authentication state after successful login
 * Used by login page to properly set tokens and trigger middleware
 */
export function setAuthenticationState(accessToken: string, refreshToken?: string): void {
  setTokens(accessToken, refreshToken);
  
  // Trigger any auth state listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-state-changed', {
      detail: { authenticated: true, accessToken }
    }));
  }
}

/**
 * Clear authentication state and trigger logout
 * Coordinates with middleware for proper cleanup
 */
export function clearAuthenticationState(redirectTo?: string): void {
  clearTokens();
  
  // Trigger any auth state listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-state-changed', {
      detail: { authenticated: false }
    }));
    
    // Navigate to specified route or home
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }
}

/**
 * Check if user has specific permissions (placeholder for future implementation)
 */
export function hasPermission(permission: string): boolean {
  const tokens = getTokens();
  if (!tokens.access) return false;
  
  const payload = decodeJWT(tokens.access);
  if (!payload) return false;
  
  // For now, just check if user is authenticated
  // In the future, this could check roles/permissions from token
  return !isTokenExpired(tokens.access);
}

/**
 * Get redirect URL from query parameters (used after login)
 */
export function getRedirectUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect');
  } catch {
    return null;
  }
}

/**
 * Handle authentication error consistently across the app
 */
export function handleAuthError(error: any): void {
  console.error('Authentication error:', error);
  
  // Clear potentially invalid tokens
  clearTokens();
  
  // Redirect to login if not already there
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    const currentPath = window.location.pathname;
    window.location.href = `/login${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`;
  }
}