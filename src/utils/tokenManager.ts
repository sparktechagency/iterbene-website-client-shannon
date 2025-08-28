import CryptoJS from 'crypto-js';

// Encryption key - এটি environment variable হতে হবে production এ
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-change-in-production';

// Token types
export enum TokenType {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  EMAIL_VERIFICATION_TOKEN = 'emailVerificationToken',
  RESET_PASSWORD_TOKEN = 'resetPasswordToken'
}

// Cookie names - obfuscated for security
const COOKIE_NAMES = {
  [TokenType.ACCESS_TOKEN]: 'iat',       // encrypted access token
  [TokenType.REFRESH_TOKEN]: 'irt',      // encrypted refresh token
  [TokenType.EMAIL_VERIFICATION_TOKEN]: 'ievt', // encrypted email verification token
  [TokenType.RESET_PASSWORD_TOKEN]: 'irpt'      // encrypted reset password token
};

// Encrypt function
const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

// Decrypt function
const decrypt = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Set token in encrypted cookie
export const setToken = (tokenType: TokenType, token: string, expiryHours: number = 168): void => {
  const encrypted = encrypt(token);
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + expiryHours);
  
  document.cookie = `${COOKIE_NAMES[tokenType]}=${encrypted}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`;
};

// Get token from encrypted cookie
export const getToken = (tokenType: TokenType): string | null => {
  const cookieName = COOKIE_NAMES[tokenType];
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName && value) {
      try {
        return decrypt(value);
      } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
      }
    }
  }
  return null;
};

// Remove token
export const removeToken = (tokenType: TokenType): void => {
  document.cookie = `${COOKIE_NAMES[tokenType]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Clear all tokens
export const clearAllTokens = (): void => {
  Object.values(TokenType).forEach(tokenType => {
    removeToken(tokenType);
  });
};

// Get appropriate token for API calls
export const getApiToken = (): string | null => {
  // For regular API calls, use access token
  return getToken(TokenType.ACCESS_TOKEN);
};

// Get token for specific auth operations
export const getAuthToken = (operation: 'verify-email' | 'reset-password'): string | null => {
  switch (operation) {
    case 'verify-email':
      return getToken(TokenType.EMAIL_VERIFICATION_TOKEN);
    case 'reset-password':
      return getToken(TokenType.RESET_PASSWORD_TOKEN);
    default:
      return null;
  }
};

// Handle auth response and store tokens
export const handleAuthResponse = (response: any, operation: string): void => {
  const { data } = response;
  
  switch (operation) {
    case 'register':
    case 'login-not-verified':
      if (data?.attributes?.emailVerificationToken) {
        setToken(TokenType.EMAIL_VERIFICATION_TOKEN, data.attributes.emailVerificationToken, 1); // 1 hour
      }
      break;
      
    case 'login-success':
    case 'verify-otp':
      if (data?.attributes?.tokens) {
        // Clear verification tokens first
        removeToken(TokenType.EMAIL_VERIFICATION_TOKEN);
        removeToken(TokenType.RESET_PASSWORD_TOKEN);
        
        // Set access and refresh tokens
        setToken(TokenType.ACCESS_TOKEN, data.attributes.tokens.accessToken, 120); // 5 days
        setToken(TokenType.REFRESH_TOKEN, data.attributes.tokens.refreshToken, 8760); // 1 year
      }
      break;
      
    case 'forgot-password':
      if (data?.attributes?.resetPasswordToken) {
        setToken(TokenType.RESET_PASSWORD_TOKEN, data.attributes.resetPasswordToken, 2); // 2 hours
      }
      break;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getToken(TokenType.ACCESS_TOKEN) !== null;
};

// Check if tokens need refresh
export const needsTokenRefresh = (): boolean => {
  const accessToken = getToken(TokenType.ACCESS_TOKEN);
  const refreshToken = getToken(TokenType.REFRESH_TOKEN);
  
  if (!accessToken && refreshToken) {
    return true;
  }
  
  return false;
};