import { NextRequest, NextResponse } from "next/server";

// Helper function to check for authentication
function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  return !!accessToken && !!refreshToken;
}

// Middleware function to protect routes
export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    // If not authenticated, redirect to the login page
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_url", request.nextUrl.pathname); // Save the original path
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /* Root protected routes */
    "/stories/:path*",
    "/messages/:path*",
    "/connections/:path*",
    "/groups/:path*",
    "/events/:path*",

    /* User-specific routes */
    "/:userName/connections",
    "/:userName/groups",
    "/:userName/invitations",
    "/:userName/itinerary",
    "/:userName/maps",
    "/:userName/photos",
    "/:userName/privacy",
    "/:userName/timeline",
    "/:userName/videos",
  ],
};
