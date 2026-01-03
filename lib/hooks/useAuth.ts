'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetProfileQuery,
} from '@/lib/store/slices/authApi';
import { setUser, logout as logoutAction } from '@/lib/store/slices/authSlice';
import { getToken, removeToken } from '@/lib/utils/token';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();
  
  // Check if we have a token
  const hasToken = typeof window !== 'undefined' && !!getToken();
  
  // Auto-fetch profile on mount if token exists
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  // Initialize auth state on mount
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const token = getToken();
    
    if (!token) {
      setIsInitialized(true);
      return;
    }

    // If we have a token and user already, we're initialized
    if (token && user) {
      setIsInitialized(true);
      return;
    }

    // If we have a token but no user, wait for profile query
    if (token && !user && !isProfileLoading) {
      if (profile) {
        dispatch(setUser(profile));
        setIsInitialized(true);
      } else if (profileError) {
        // If profile fetch fails, clear token
        if ('status' in profileError && profileError.status === 401) {
          removeToken();
          dispatch(setUser(null));
        }
        setIsInitialized(true);
      }
    }
  }, [hasToken, user, profile, profileError, isProfileLoading, dispatch]);

  // Sync profile data to Redux state when profile is fetched
  useLayoutEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
      setIsInitialized(true);
    }
  }, [profile, dispatch]);

  // Handle 401 errors - clear token
  useLayoutEffect(() => {
    if (profileError && 'status' in profileError && profileError.status === 401) {
      removeToken();
      dispatch(setUser(null));
      setIsInitialized(true);
    }
  }, [profileError, dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation({ email, password }).unwrap();
    dispatch(setUser(result.user));
    setIsInitialized(true);
  }, [loginMutation, dispatch]);

  const register = useCallback(async (
    displayName: string, 
    email: string, 
    password: string
  ) => {
    await registerMutation({ displayName, email, password }).unwrap();
  }, [registerMutation]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    setIsInitialized(true);
  }, [dispatch]);

  // Helper to extract error message from RTK Query error
  const getErrorMessage = (error: unknown): string | null => {
    if (!error) return null;
    if (typeof error === 'object' && 'data' in error) {
      const data = (error as { data: unknown }).data;
      if (typeof data === 'object' && data && 'message' in data) {
        return String((data as { message: string }).message);
      }
    }
    return 'Something went wrong';
  };

  // isLoading is true if we're still initializing OR loading profile
  const isLoading = !isInitialized || (hasToken && isProfileLoading);

  return {
    user,
    isAuthenticated,
    isLoading,
    isLoginLoading,
    isRegisterLoading,
    loginError: getErrorMessage(loginError),
    registerError: getErrorMessage(registerError),
    login,
    register,
    logout,
  };
}
