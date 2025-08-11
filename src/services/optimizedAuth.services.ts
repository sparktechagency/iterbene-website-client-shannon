import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface IDecodeData {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Configuration constants
const TOKEN_EXPIRY_DAYS = 7; // Access token expires in 7 days
const REFRESH_TOKEN_EXPIRY_DAYS = 30; // Refresh token expires in 30 days
const BUFFER_TIME = 5 * 60; // 5 minutes buffer before token expiry

// Cookie configuration with security improvements
const cookieConfig = {
  path: "/",
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax" as const, // CSRF protection
  httpOnly: false, // We need to read these on client side
};

// Store the access token and refresh token in cookies with improved security
export const storeTokens = (accessToken: string, refreshToken: string) => {
  try {
    Cookies.set("accessToken", accessToken, {
      ...cookieConfig,
      expires: TOKEN_EXPIRY_DAYS,
    });
    Cookies.set("refreshToken", refreshToken, {
      ...cookieConfig,
      expires: REFRESH_TOKEN_EXPIRY_DAYS,
    });
    
    // Store timestamp for tracking
    localStorage.setItem("tokenStoredAt", Date.now().toString());
  } catch (error) {
    console.error("Failed to store tokens:", error);
    throw new Error("Failed to store authentication tokens");
  }
};

// Get access token from cookies with validation
export const getAccessToken = (): string | undefined => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return undefined;
    
    // Basic token format validation
    if (token.split('.').length !== 3) {
      console.warn("Invalid token format detected");
      clearTokens();
      return undefined;
    }
    
    return token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return undefined;
  }
};

// Get refresh token from cookies with validation
export const getRefreshToken = (): string | undefined => {
  try {
    const token = Cookies.get("refreshToken");
    if (!token) return undefined;
    
    // Basic token format validation
    if (token.split('.').length !== 3) {
      console.warn("Invalid refresh token format detected");
      clearTokens();
      return undefined;
    }
    
    return token;
  } catch (error) {
    console.error("Failed to get refresh token:", error);
    return undefined;
  }
};

// Decode the access token and check if it's expired with buffer time
export const isTokenExpired = (accessToken: string): boolean => {
  try {
    const decoded: IDecodeData = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Add buffer time to prevent race conditions
    return decoded.exp < (currentTime + BUFFER_TIME);
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume expired if decoding fails
  }
};

// Check if refresh token is expired
export const isRefreshTokenExpired = (refreshToken: string): boolean => {
  try {
    const decoded: IDecodeData = jwtDecode(refreshToken);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding refresh token:", error);
    return true;
  }
};

// Enhanced token validation
export const isTokenValid = (token?: string): boolean => {
  if (!token) return false;
  
  try {
    const decoded: IDecodeData = jwtDecode(token);
    
    // Check if token has required fields
    if (!decoded.userId || !decoded.email || !decoded.exp) {
      return false;
    }
    
    // Check if token is not expired
    return !isTokenExpired(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

// Get user data from token
export const getUserFromToken = (token?: string): Partial<IDecodeData> | null => {
  try {
    if (!token || !isTokenValid(token)) return null;
    
    const decoded: IDecodeData = jwtDecode(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Failed to get user from token:", error);
    return null;
  }
};

// Clear tokens and related storage with comprehensive cleanup
export const clearTokens = () => {
  try {
    // Remove cookies
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    
    // Clear localStorage
    localStorage.removeItem("tokenStoredAt");
    localStorage.removeItem("user");
    
    // Clear custom cookies
    // Note: Custom cookies are now handled by the reactive cookie context
    
    // Clear sessionStorage
    sessionStorage.clear();
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  // If we have a valid access token, user is authenticated
  if (accessToken && isTokenValid(accessToken)) {
    return true;
  }
  
  // If access token is invalid but refresh token exists and is valid
  if (refreshToken && !isRefreshTokenExpired(refreshToken)) {
    return true; // Let the refresh logic handle this
  }
  
  return false;
};

// Get time until token expires (in seconds)
export const getTokenExpiryTime = (token?: string): number | null => {
  try {
    if (!token) return null;
    
    const decoded: IDecodeData = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return Math.max(0, decoded.exp - currentTime);
  } catch (error) {
    console.error("Failed to get token expiry time:", error);
    return null;
  }
};

// Legacy compatibility exports (keeping original function names)
export const removeTokens = clearTokens;