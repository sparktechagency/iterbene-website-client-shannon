import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface IDecodeData {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const TOKEN_EXPIRY_DAYS = 7; // Token expires in 7 days
const REFRESH_TOKEN_EXPIRY_DAYS = 30; 

// Store the access token and refresh token in cookies with 7 days expiry
export const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, {
    expires: TOKEN_EXPIRY_DAYS,
    path: "/",
  });
  Cookies.set("refreshToken", refreshToken, {
    expires: REFRESH_TOKEN_EXPIRY_DAYS,
    path: "/",
  });
};

// Get access token from cookies
export const getAccessToken = (): string | undefined => {
  return Cookies.get("accessToken");
};

// Get refresh token from cookies
export const getRefreshToken = (): string | undefined => {
  return Cookies.get("refreshToken");
};

// Decode the access token and check if it's expired
export const isTokenExpired = (accessToken: string): boolean => {
  try {
    const decoded: IDecodeData = jwtDecode(accessToken); // Decode the token
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decoded.exp < currentTime; // Check if token is expired
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume expired if decoding fails
  }
};

// Remove tokens from cookies
export const removeTokens = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
};
