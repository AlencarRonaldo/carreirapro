export interface AuthTokens {
  access: string | null;
  refresh: string | null;
}

export interface JWTPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface AuthUser {
  id: string;
  email: string;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens;
  isLoading: boolean;
  isValidating: boolean;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthMiddlewareConfig {
  protectedRoutes: string[];
  publicRoutes: string[];
  loginPath: string;
  redirectAfterLogin: string;
  tokenCookieName: string;
  refreshCookieName: string;
}

export interface MiddlewareAuthResult {
  isAuthenticated: boolean;
  shouldRedirect: boolean;
  redirectUrl?: string;
  error?: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  payload: JWTPayload | null;
  error?: string;
}

export interface MiddlewareRequest {
  pathname: string;
  token?: string | null;
  refreshToken?: string | null;
  headers: Record<string, string>;
}

export interface MiddlewareResponse {
  type: 'next' | 'redirect' | 'rewrite';
  url?: string;
  headers?: Record<string, string>;
  cookies?: {
    set?: Array<{ name: string; value: string; options?: any }>;
    delete?: string[];
  };
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'expired' | 'validating';