import Cookies from "js-cookie";

// Cookie names
export const COOKIE_NAMES = {
  ITER_BENE_VERIFIED: "iterBeneVerified",
  LOCATION_PERMISSION_DENIED: "locationPermissionDenied", 
  LOCATION_PERMISSION_GRANTED: "locationPermissionGranted",
  PROFILE_COMPLETED: "profileCompleted",
  USER_LAST_LOCATION: "userLastLocation",
  IS_FIRST_TIME_USER: "isFirstTimeUser"
} as const;

// Cookie utilities
export const cookieUtils = {
  // Set a cookie with optional expiry (defaults to 30 days)
  set: (name: string, value: string, days: number = 30) => {
    Cookies.set(name, value, { expires: days });
  },

  // Get a cookie value
  get: (name: string): string | undefined => {
    return Cookies.get(name);
  },

  // Remove a cookie
  remove: (name: string) => {
    Cookies.remove(name);
  },

  // Check if cookie exists and has specific value
  is: (name: string, value: string): boolean => {
    return Cookies.get(name) === value;
  },

  // Set boolean cookie
  setBoolean: (name: string, value: boolean, days: number = 30) => {
    Cookies.set(name, value.toString(), { expires: days });
  },

  // Get boolean cookie
  getBoolean: (name: string): boolean => {
    return Cookies.get(name) === "true";
  },

  // Set object cookie
  setObject: (name: string, value: any, days: number = 30) => {
    Cookies.set(name, JSON.stringify(value), { expires: days });
  },

  // Get object cookie
  getObject: (name: string): any => {
    const value = Cookies.get(name);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
};

// Migrate from localStorage to cookies
export const migrateFromLocalStorage = () => {
  if (typeof window === "undefined") return;

  const migrations = [
    { localStorage: "iterBeneVerified", cookie: COOKIE_NAMES.ITER_BENE_VERIFIED },
    { localStorage: "locationPermissionDenied", cookie: COOKIE_NAMES.LOCATION_PERMISSION_DENIED },
    { localStorage: "locationPermissionGranted", cookie: COOKIE_NAMES.LOCATION_PERMISSION_GRANTED },
    { localStorage: "profileCompleted", cookie: COOKIE_NAMES.PROFILE_COMPLETED },
    { localStorage: "userLastLocation", cookie: COOKIE_NAMES.USER_LAST_LOCATION }
  ];

  migrations.forEach(({ localStorage, cookie }) => {
    const value = localStorage.getItem ? window.localStorage.getItem(localStorage) : null;
    if (value) {
      cookieUtils.set(cookie, value);
      localStorage.removeItem ? window.localStorage.removeItem(localStorage) : null;
    }
  });
};