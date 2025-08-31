import { clearAllTokens, isAuthenticated, getApiToken } from './tokenManager';
import { store } from '@/redux/store';
import { baseApi } from '@/redux/features/api/baseApi';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Complete logout functionality that clears all user data and tokens
 * @param router - Next.js router instance (optional)
 * @param redirectPath - Path to redirect after logout (default: "/login")
 */
export const performLogout = async (router?: AppRouterInstance | null, redirectPath: string = "/login") => {
  try {
    clearAllTokens();
    
    // Step 2: Clear all Redux RTK Query cache
    console.info('Clearing Redux cache...');
    store.dispatch(baseApi.util.resetApiState());
  
    if (typeof window !== 'undefined') {
      console.info('Clearing localStorage...');
      // Clear any app-specific localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('app_') || key.startsWith('user_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage items (if any)
      sessionStorage.clear();
    }
    if (router) {
      await router.push(redirectPath);
    } else if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
    
    // Step 7: Force reload to ensure complete cleanup
    if (typeof window !== 'undefined') {
      // Small delay to ensure navigation happens first
      setTimeout(() => {
        console.info('Forcing page reload...');
        window.location.reload();
      }, 100);
    }
    
    console.info('Logout completed successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    
    // Fallback: Force clear and redirect
    if (typeof window !== 'undefined') {
      // Clear all cookies manually as fallback
      document.cookie.split(";").forEach((cookie: string) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // Force redirect
      window.location.href = redirectPath;
    }
  }
};

/**
 * Check if user should be logged out due to token issues
 */
export const checkAndHandleTokenExpiry = (router?: AppRouterInstance | null) => {
  try {
    // This can be called when API returns 401 or token validation fails
    performLogout(router, "/login");
  } catch (error) {
    console.error('Error handling token expiry:', error);
  }
};

/**
 * Debug function to check current authentication state
 */
export const debugAuthState = () => {
  if (typeof window !== 'undefined') {
    console.group('🔍 Authentication Debug Info');
    
    // Check cookies
    console.log('📄 Cookies:', document.cookie);
    
    // Check localStorage
    console.log('💾 LocalStorage keys:', Object.keys(localStorage));
    
    // Check if tokens exist
    try {
      console.log('🔐 Is Authenticated:', isAuthenticated());
      console.log('🎫 Has API Token:', !!getApiToken());
    } catch (error) {
      console.error('Error checking tokens:', error);
    }
    
    // Check Redux store state
    try {
      console.log('🗄️ Redux Store State Keys:', Object.keys(store.getState()));
    } catch (error) {
      console.error('Error checking Redux state:', error);
    }
    
    console.groupEnd();
  }
};