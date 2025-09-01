"use client";
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { removeCookie, getCookie, COOKIE_NAMES } from '@/utils/cookies';

export const useAuth = () => {
  const router = useRouter();
  // Using direct imports

  const logout = useCallback(() => {
    try {
      // Clear access and refresh token cookies
      removeCookie(COOKIE_NAMES.ACCESS_TOKEN);
      removeCookie(COOKIE_NAMES.REFRESH_TOKEN);
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear other cookies
      removeCookie(COOKIE_NAMES.REGISTER_VERIFY_MAIL);
      removeCookie(COOKIE_NAMES.FORGOT_PASSWORD_MAIL);
      removeCookie(COOKIE_NAMES.VERIFY_EMAIL_TYPE);
      
      // Navigate to login page
      router.push('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force reload
      window.location.href = '/login';
    }
  }, [router]);

  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return !!getCookie(COOKIE_NAMES.ACCESS_TOKEN);
  }, [getCookie]);

  return {
    logout,
    isAuthenticated,
  };
};