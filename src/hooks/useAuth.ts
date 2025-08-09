import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cookieUtils, COOKIE_NAMES } from '@/utils/cookies';

export const useAuth = () => {
  const router = useRouter();

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
      cookieUtils.remove(COOKIE_NAMES.ITER_BENE_VERIFIED);
      cookieUtils.remove(COOKIE_NAMES.PROFILE_COMPLETED);
      cookieUtils.remove(COOKIE_NAMES.IS_FIRST_TIME_USER);
      cookieUtils.remove(COOKIE_NAMES.LOCATION_PERMISSION_DENIED);
      cookieUtils.remove(COOKIE_NAMES.LOCATION_PERMISSION_GRANTED);
      cookieUtils.remove(COOKIE_NAMES.USER_LAST_LOCATION);
      
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
  }, [router]);

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