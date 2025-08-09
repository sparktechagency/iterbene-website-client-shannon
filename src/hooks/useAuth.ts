import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies, COOKIE_NAMES } from '@/contexts/CookieContext';

export const useAuth = () => {
  const router = useRouter();
  const { removeCookie } = useCookies();

  const logout = useCallback(() => {
    try {
      // Clear cookies
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      
      // Clear localStorage
      localStorage.removeItem('user');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear custom cookies
      removeCookie(COOKIE_NAMES.ITER_BENE_VERIFIED);
      removeCookie(COOKIE_NAMES.PROFILE_COMPLETED);
      removeCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
      removeCookie(COOKIE_NAMES.LOCATION_PERMISSION_DENIED);
      removeCookie(COOKIE_NAMES.LOCATION_PERMISSION_GRANTED);
      removeCookie(COOKIE_NAMES.USER_LAST_LOCATION);
      
      // Navigate to home before reload to prevent flash
      router.push('/');
      
      // Small delay to ensure navigation starts before reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force reload anyway
      window.location.href = '/';
    }
  }, [router, removeCookie]);

  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    return !!accessToken;
  }, []);

  return {
    logout,
    isAuthenticated,
  };
};