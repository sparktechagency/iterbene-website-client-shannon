import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies, COOKIE_NAMES } from '@/contexts/CookieContext';
import { clearAllTokens, isAuthenticated as checkTokenAuth } from '@/utils/tokenManager';

export const useAuth = () => {
  const router = useRouter();
  const { removeCookie } = useCookies();

  const logout = useCallback(() => {
    try {
      // Clear all encrypted auth tokens
      clearAllTokens();
      
      // Clear localStorage
      localStorage.removeItem('user');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear custom encrypted cookies
      removeCookie(COOKIE_NAMES.ITER_BENE_VERIFIED);
      removeCookie(COOKIE_NAMES.PROFILE_COMPLETED);
      removeCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
      removeCookie(COOKIE_NAMES.LOCATION_PERMISSION_DENIED);
      removeCookie(COOKIE_NAMES.LOCATION_PERMISSION_GRANTED);
      removeCookie(COOKIE_NAMES.USER_LAST_LOCATION);
      
      // Navigate to auth page before reload to prevent flash
      router.push('/auth');
      
      // Small delay to ensure navigation starts before reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force reload anyway
      window.location.href = '/auth';
    }
  }, [router, removeCookie]);

  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return checkTokenAuth();
  }, []);

  return {
    logout,
    isAuthenticated,
  };
};