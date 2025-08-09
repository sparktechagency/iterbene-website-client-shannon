// Re-export from the new context for backward compatibility
export { COOKIE_NAMES, migrateFromLocalStorage } from "@/contexts/CookieContext";

// Backward compatibility - but recommend using useCookies hook instead
export const cookieUtils = {
  // Note: These are non-reactive versions. Use useCookies() hook for reactive updates
  set: (name: string, value: string, days: number = 30) => {
    console.warn("cookieUtils.set is deprecated. Use useCookies() hook for reactive updates.");
    document.cookie = `${name}=${value}; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
  },

  get: (name: string): string | undefined => {
    console.warn("cookieUtils.get is deprecated. Use useCookies() hook for reactive updates.");
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  },

  remove: (name: string) => {
    console.warn("cookieUtils.remove is deprecated. Use useCookies() hook for reactive updates.");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },

  is: (name: string, value: string): boolean => {
    return cookieUtils.get(name) === value;
  },

  setBoolean: (name: string, value: boolean, days: number = 30) => {
    cookieUtils.set(name, value.toString(), days);
  },

  getBoolean: (name: string): boolean => {
    return cookieUtils.get(name) === "true";
  },

  setObject: (name: string, value: unknown, days: number = 30) => {
    cookieUtils.set(name, JSON.stringify(value), days);
  },

  getObject: (name: string): unknown => {
    const value = cookieUtils.get(name);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
};