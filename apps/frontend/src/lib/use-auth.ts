import { useState, useEffect } from 'react';
import {
  getAuthStatus,
  validateAuthentication,
  clearAuthenticationState,
  getUserFromToken,
  handleAuthError,
  getRedirectUrl
} from './auth-utils';
import type { AuthStatus, AuthUser } from '@/types/auth';

interface UseAuthResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isValidating: boolean;
  status: AuthStatus;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: (redirectTo?: string) => void;
  checkAuth: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook for authentication state management
 * Provides a unified interface for authentication across components
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setError(null);
      const currentStatus = getAuthStatus();
      
      if (currentStatus === 'expired') {
        setIsValidating(true);
        const isValid = await validateAuthentication();
        
        if (isValid) {
          const userInfo = getUserFromToken();
          setUser(userInfo ? { ...userInfo, isAuthenticated: true } : null);
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }
        
        setIsValidating(false);
      } else if (currentStatus === 'authenticated') {
        const userInfo = getUserFromToken();
        setUser(userInfo ? { ...userInfo, isAuthenticated: true } : null);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Failed to validate authentication');
      setUser(null);
      setStatus('unauthenticated');
      setIsValidating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (accessToken: string, refreshToken?: string) => {
    try {
      // Import here to avoid SSR issues
      import('./auth-utils').then(({ setAuthenticationState }) => {
        setAuthenticationState(accessToken, refreshToken);
        checkAuth();
      });
    } catch (err) {
      setError('Login failed');
      handleAuthError(err);
    }
  };

  const logout = (redirectTo?: string) => {
    try {
      setUser(null);
      setStatus('unauthenticated');
      clearAuthenticationState(redirectTo);
    } catch (err) {
      setError('Logout failed');
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    // Initial authentication check
    checkAuth();

    // Listen for auth state changes
    const handleAuthChange = (event: CustomEvent) => {
      const { authenticated } = event.detail;
      
      if (authenticated) {
        checkAuth();
      } else {
        setUser(null);
        setStatus('unauthenticated');
        setIsLoading(false);
      }
    };

    // Listen for storage changes (multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cp_token' || event.key === 'cp_refresh') {
        checkAuth();
      }
    };

    // Listen for focus events to re-validate auth
    const handleFocus = () => {
      if (!isLoading && status === 'authenticated') {
        checkAuth();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-state-changed', handleAuthChange as EventListener);
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('focus', handleFocus);
      
      return () => {
        window.removeEventListener('auth-state-changed', handleAuthChange as EventListener);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [isLoading, status]);

  return {
    user,
    isAuthenticated: status === 'authenticated' && user !== null,
    isLoading,
    isValidating,
    status,
    login,
    logout,
    checkAuth,
    error
  };
}

/**
 * Hook for protected routes - redirects to login if not authenticated
 */
export function useRequireAuth(): UseAuthResult {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && typeof window !== 'undefined') {
      const redirectUrl = getRedirectUrl();
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page
      if (!currentPath.includes('/login')) {
        const loginUrl = `/login${currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''}`;
        window.location.href = loginUrl;
      }
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  
  return auth;
}

/**
 * Hook to handle post-login redirects
 */
export function useAuthRedirect() {
  const auth = useAuth();
  
  useEffect(() => {
    if (auth.isAuthenticated && typeof window !== 'undefined') {
      const redirectUrl = getRedirectUrl();
      
      if (redirectUrl && redirectUrl !== window.location.pathname) {
        // Clear redirect parameter and navigate
        const url = new URL(window.location.href);
        url.searchParams.delete('redirect');
        window.history.replaceState({}, '', url.toString());
        window.location.href = redirectUrl;
      }
    }
  }, [auth.isAuthenticated]);
  
  return auth;
}