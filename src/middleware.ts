import CryptoJS from 'crypto-js';
import { NextRequest, NextResponse } from "next/server";

// Encryption key
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-change-in-production';

// Cookie names - must match utils/cookies.ts
const COOKIE_NAMES = {
  ACCESS_TOKEN: 'at',   // accessToken -> at
  REFRESH_TOKEN: 'rt'   // refreshToken -> rt
};

// Decrypt function
function decrypt(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}

// Helper function to check for authentication
function isAuthenticated(request: NextRequest): boolean {
  const encryptedAccessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const encryptedRefreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  
  if (!encryptedAccessToken && !encryptedRefreshToken) {
    return false;
  }
  
  // Try to decrypt tokens to verify they're valid
  if (encryptedAccessToken) {
    const accessToken = decrypt(encryptedAccessToken);
    if (accessToken) {
      return true; // User has valid access token
    }
  }
  
  if (encryptedRefreshToken) {
    const refreshToken = decrypt(encryptedRefreshToken);
    if (refreshToken) {
      return true; // User has valid refresh token (can be used to get new access token)
    }
  }
  
  return false;
}

// Middleware function to protect routes
export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    // If not authenticated, redirect to the auth page
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("redirect_url", request.nextUrl.pathname); // Save the original path
    return NextResponse.redirect(authUrl);
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth, login, register, forgot-password, etc. (auth pages)
     * - about-us, privacy-policy, terms-and-conditions (public pages)
     * - feed, search, journeys, photos, watch-videos (public pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth|login|register|forgot-password|reset-password|verify-otp|about-us|privacy-policy|terms-and-conditions|feed|search|journeys|photos|watch-videos).*)",
  ],
};
