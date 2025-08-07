import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  const logout = useCallback(() => {
    try {
      // Clear cookies
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      
      // Clear localStorage
      localStorage.removeItem('iterBeneVerified');
      localStorage.removeItem('user');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
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