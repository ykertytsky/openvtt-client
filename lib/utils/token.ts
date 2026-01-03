/**
 * Token utility functions for syncing between localStorage and cookies
 * Cookies are needed for Next.js middleware to check authentication
 */

const TOKEN_COOKIE_NAME = 'accessToken';

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  
  // Store in localStorage for client-side access
  localStorage.setItem(TOKEN_COOKIE_NAME, token);
  
  // Store in cookie for middleware access
  // Set cookie with httpOnly: false so client can read it if needed
  // Set secure: true in production, sameSite: 'lax' for CSRF protection
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isProduction ? '; Secure' : ''}`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_COOKIE_NAME);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  
  // Remove from localStorage
  localStorage.removeItem(TOKEN_COOKIE_NAME);
  
  // Remove cookie by setting max-age to 0
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
}

