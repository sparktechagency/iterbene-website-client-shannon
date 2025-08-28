"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import CryptoJS from 'crypto-js';

// Encryption key - should match tokenManager
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-change-in-production';

// Obfuscated cookie names (user won't understand what these are)
export const COOKIE_NAMES = {
  ITER_BENE_VERIFIED: "ibv",           // iterBeneVerified -> ibv
  LOCATION_PERMISSION_DENIED: "lpd",   // locationPermissionDenied -> lpd
  LOCATION_PERMISSION_GRANTED: "lpg", // locationPermissionGranted -> lpg  
  PROFILE_COMPLETED: "pc",             // profileCompleted -> pc
  IS_FIRST_TIME_USER: "iftu",          // isFirstTimeUser -> iftu
  USER_LAST_LOCATION: "ull"            // userLastLocation -> ull
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
  } catch (error) {
    return '';
  }
};

interface CookieContextType {
  // Cookie values
  cookieValues: Record<string, string | undefined>;
  
  // Cookie methods
  setCookie: (name: string, value: string, days?: number) => void;
  getCookie: (name: string) => string | undefined;
  removeCookie: (name: string) => void;
  
  // Boolean helpers
  setBooleanCookie: (name: string, value: boolean, days?: number) => void;
  getBooleanCookie: (name: string) => boolean;
  
  // Object helpers
  setObjectCookie: (name: string, value: unknown, days?: number) => void;
  getObjectCookie: (name: string) => unknown;
  
  // Check helper
  isCookie: (name: string, value: string) => boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookieValues, setCookieValues] = useState<Record<string, string | undefined>>({});

  // Initialize cookie values on mount and watch for changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateAllCookieValues = () => {
        const currentValues: Record<string, string | undefined> = {};
        Object.values(COOKIE_NAMES).forEach((cookieName) => {
          const encryptedValue = Cookies.get(cookieName);
          if (encryptedValue) {
            const decryptedValue = decrypt(encryptedValue);
            currentValues[cookieName] = decryptedValue || undefined;
          }
        });
        setCookieValues(currentValues);
      };

      // Initial load
      updateAllCookieValues();

      // Watch for cookie changes periodically (for cases where cookies change externally)
      const interval = setInterval(updateAllCookieValues, 5000);
      
      return () => clearInterval(interval);
    }
  }, []);

  // Update local state when cookie changes
  const updateCookieState = useCallback((name: string, value: string | undefined) => {
    setCookieValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setCookie = useCallback((name: string, value: string, days: number = 30) => {
    // Encrypt the value before storing
    const encryptedValue = encrypt(value);
    Cookies.set(name, encryptedValue, { 
      expires: days,
      secure: true, 
      sameSite: 'strict' 
    });
    updateCookieState(name, value); // Store decrypted value in state
  }, [updateCookieState]);

  const getCookie = useCallback((name: string): string | undefined => {
    // Return from state for real-time updates
    if (cookieValues[name] !== undefined) {
      return cookieValues[name];
    }
    
    // Fallback to direct cookie read and decrypt (without updating state during render)
    const encryptedValue = Cookies.get(name);
    if (encryptedValue) {
      const decryptedValue = decrypt(encryptedValue);
      return decryptedValue || undefined;
    }
    return undefined;
  }, [cookieValues]);

  const removeCookie = useCallback((name: string) => {
    Cookies.remove(name);
    updateCookieState(name, undefined);
  }, [updateCookieState]);

  const setBooleanCookie = useCallback((name: string, value: boolean, days: number = 30) => {
    setCookie(name, value.toString(), days);
  }, [setCookie]);

  const getBooleanCookie = useCallback((name: string): boolean => {
    return getCookie(name) === "true";
  }, [getCookie]);

  const setObjectCookie = useCallback((name: string, value: unknown, days: number = 30) => {
    setCookie(name, JSON.stringify(value), days);
  }, [setCookie]);

  const getObjectCookie = useCallback((name: string): unknown => {
    const value = getCookie(name);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }, [getCookie]);

  const isCookie = useCallback((name: string, value: string): boolean => {
    return getCookie(name) === value;
  }, [getCookie]);

  const value: CookieContextType = {
    cookieValues,
    setCookie,
    getCookie,
    removeCookie,
    setBooleanCookie,
    getBooleanCookie,
    setObjectCookie,
    getObjectCookie,
    isCookie,
  };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookies must be used within a CookieProvider");
  }
  return context;
};

// Migration function for backward compatibility
export const migrateFromLocalStorage = () => {
  if (typeof window === "undefined") return;

  const migrations = [
    { localStorage: "iterBeneVerified", cookie: COOKIE_NAMES.ITER_BENE_VERIFIED },
    { localStorage: "locationPermissionDenied", cookie: COOKIE_NAMES.LOCATION_PERMISSION_DENIED },
    { localStorage: "locationPermissionGranted", cookie: COOKIE_NAMES.LOCATION_PERMISSION_GRANTED },
    { localStorage: "profileCompleted", cookie: COOKIE_NAMES.PROFILE_COMPLETED },
    { localStorage: "isFirstTimeUser", cookie: COOKIE_NAMES.IS_FIRST_TIME_USER },
  ];

  migrations.forEach(({ localStorage, cookie }) => {
    const value = window.localStorage.getItem ? window.localStorage.getItem(localStorage) : null;
    if (value) {
      // Encrypt the value before setting cookie
      const encryptedValue = encrypt(value);
      Cookies.set(cookie, encryptedValue, { 
        secure: true, 
        sameSite: 'strict' 
      });
      if (window.localStorage.removeItem) {
        window.localStorage.removeItem(localStorage);
      }
    }
  });
  
  // Also migrate from old unencrypted cookies to new encrypted ones
  const oldCookieMigrations = [
    { old: "iterBeneVerified", new: COOKIE_NAMES.ITER_BENE_VERIFIED },
    { old: "locationPermissionDenied", new: COOKIE_NAMES.LOCATION_PERMISSION_DENIED },
    { old: "locationPermissionGranted", new: COOKIE_NAMES.LOCATION_PERMISSION_GRANTED },
    { old: "profileCompleted", new: COOKIE_NAMES.PROFILE_COMPLETED },
    { old: "isFirstTimeUser", new: COOKIE_NAMES.IS_FIRST_TIME_USER },
  ];

  oldCookieMigrations.forEach(({ old, new: newCookie }) => {
    const oldValue = Cookies.get(old);
    if (oldValue && !Cookies.get(newCookie)) {
      // Encrypt old value and save with new name
      const encryptedValue = encrypt(oldValue);
      Cookies.set(newCookie, encryptedValue, { 
        secure: true, 
        sameSite: 'strict' 
      });
      // Remove old cookie
      Cookies.remove(old);
    }
  });
};