'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetProfileQuery,
} from '@/lib/store/api';
import { setUser, logout as logoutAction } from '@/lib/store/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();
  
  // Check if we have a token
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  
  // Auto-fetch profile on mount if token exists
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  // Sync profile data to Redux state
  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [profile, dispatch]);

  // Handle 401 errors - clear token
  useEffect(() => {
    if (profileError && 'status' in profileError && profileError.status === 401) {
      localStorage.removeItem('accessToken');
      dispatch(setUser(null));
    }
  }, [profileError, dispatch]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation({ email, password }).unwrap();
    dispatch(setUser(result.user));
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

  return {
    user,
    isAuthenticated,
    isLoading: isProfileLoading,
    isLoginLoading,
    isRegisterLoading,
    loginError: getErrorMessage(loginError),
    registerError: getErrorMessage(registerError),
    login,
    register,
    logout,
  };
}
