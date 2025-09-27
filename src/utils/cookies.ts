import CryptoJS from 'crypto-js';

// Encryption key
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-change-in-production';

// Cookie names - obfuscated for security
export const COOKIE_NAMES = {
  ITER_BENE_VERIFIED: "ibv",           // iterBeneVerified -> ibv
  LOCATION_PERMISSION_DENIED: "lpd",   // locationPermissionDenied -> lpd
  LOCATION_PERMISSION_GRANTED: "lpg", // locationPermissionGranted -> lpg  
  PROFILE_COMPLETED: "pc",             // profileCompleted -> pc
  IS_FIRST_TIME_USER: "iftu",          // isFirstTimeUser -> iftu
  VERIFY_OTP_MAIL: "vom",              // verifyOtpMail -> vom
  VERIFY_OTP_TYPE: "vot",              // verifyOtpType -> vot
  REGISTER_VERIFY_MAIL: "rvm",         // registerVerifyMail -> rvm
  VERIFY_EMAIL_TYPE: "vet",            // verifyEmailType -> vet
  FORGOT_PASSWORD_MAIL: "fpm",         // forgotPasswordMail -> fpm
  ACCESS_TOKEN: "at",                  // accessToken -> at
  REFRESH_TOKEN: "rt",                 // refreshToken -> rt
} as const;

// Encrypt function
const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

// Decrypt function  
const decrypt = (encryptedText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch{
    return '';
  }
};

// Set cookie function
export const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return;
  
  try {
    // Encrypt the value before storing
    const encryptedValue = encrypt(value);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    // Only use secure flag in production (HTTPS)
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; secure' : '';
    
    document.cookie = `${name}=${encryptedValue}; expires=${expiryDate.toUTCString()}; path=/${secureFlag}; samesite=strict`;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

// Get cookie function
export const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name && cookieValue) {
        const decryptedValue = decrypt(cookieValue);
        return decryptedValue || undefined;
      }
    }
  } catch (error) {
    console.error('Error getting cookie:', error);
  }
  return undefined;
};

// Remove cookie function
export const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.error('Error removing cookie:', error);
  }
};

// Set boolean cookie
export const setBooleanCookie = (name: string, value: boolean, days: number = 30): void => {

  setCookie(name, value.toString(), days);
};

// Get boolean cookie
export const getBooleanCookie = (name: string): boolean => {
  return getCookie(name) === "true";
};

// Set object cookie
export const setObjectCookie = (name: string, value: unknown, days: number = 30): void => {
  setCookie(name, JSON.stringify(value), days);
};

// Get object cookie
export const getObjectCookie = (name: string): unknown => {
  const value = getCookie(name);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Check if cookie has specific value
export const isCookie = (name: string, value: string): boolean => {
  return getCookie(name) === value;
};