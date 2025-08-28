"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";

// Cookie names
export const COOKIE_NAMES = {
  ITER_BENE_VERIFIED: "iterBeneVerified",
  LOCATION_PERMISSION_DENIED: "locationPermissionDenied", 
  LOCATION_PERMISSION_GRANTED: "locationPermissionGranted",
  PROFILE_COMPLETED: "profileCompleted",
  IS_FIRST_TIME_USER: "isFirstTimeUser"
} as const;

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

  // Initialize cookie values on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialValues: Record<string, string | undefined> = {};
      Object.values(COOKIE_NAMES).forEach((cookieName) => {
        initialValues[cookieName] = Cookies.get(cookieName);
      });
      setCookieValues(initialValues);
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
    Cookies.set(name, value, { expires: days });
    updateCookieState(name, value);
  }, [updateCookieState]);

  const getCookie = useCallback((name: string): string | undefined => {
    // Return from state for real-time updates, fallback to Cookies.get
    return cookieValues[name] ?? Cookies.get(name);
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
  ];

  migrations.forEach(({ localStorage, cookie }) => {
    const value = window.localStorage.getItem ? window.localStorage.getItem(localStorage) : null;
    if (value) {
      Cookies.set(cookie, value);
      if (window.localStorage.removeItem) {
        window.localStorage.removeItem(localStorage);
      }
    }
  });
};