/**
 * Utility functions for testing authentication and logout functionality
 * Only use these in development environment
 */

import { performLogout, debugAuthState } from './logoutManager';
import { isAuthenticated, getApiToken, clearCorruptedTokens } from './tokenManager';

/**
 * Test logout functionality - call from browser console
 */
export const testLogout = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testLogout should only be used in development');
    return;
  }

  console.group('🧪 Testing Logout Functionality');
  
  // Show auth state before logout
  console.log('📊 Auth state before logout:');
  debugAuthState();
  
  // Perform logout
  console.log('🚪 Performing logout...');
  await performLogout(null, '/login');
  
  console.groupEnd();
};

/**
 * Test authentication state - call from browser console
 */
export const testAuthState = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testAuthState should only be used in development');
    return;
  }

  console.group('🔍 Authentication State Test');
  
  console.log('🔐 Is Authenticated:', isAuthenticated());
  console.log('🎫 Has API Token:', !!getApiToken());
  
  debugAuthState();
  
  console.groupEnd();
};

/**
 * Clean corrupted tokens - call from browser console
 */
export const testCleanTokens = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testCleanTokens should only be used in development');
    return;
  }

  console.group('🧹 Cleaning Corrupted Tokens');
  
  console.log('🔧 Before cleaning:');
  debugAuthState();
  
  clearCorruptedTokens();
  
  console.log('✅ After cleaning:');
  debugAuthState();
  
  console.groupEnd();
};

// Make functions available in browser console for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.testLogout = testLogout;
  // @ts-ignore
  window.testAuthState = testAuthState;
  // @ts-ignore
  window.testCleanTokens = testCleanTokens;
  
  console.info('🔧 Auth test utilities loaded. Available functions:');
  console.info('- testLogout() - Test logout functionality');
  console.info('- testAuthState() - Check current auth state');
  console.info('- testCleanTokens() - Clean corrupted tokens');
}