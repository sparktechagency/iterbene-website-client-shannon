import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
} from "@/services/auth.services";
import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

// Track refresh attempts to prevent infinite loops
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Enhanced error handling
const handleAuthError = (message: string) => {
  toast.error(message);
  clearTokens();
  // Delay navigation to avoid flash
  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
};

// Define base query with timeout and authorization headers
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  timeout: 30000, // Increased to 30 seconds for better UX
});

// Token refresh function with proper error handling
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    handleAuthError("Session expired. Please log in again.");
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        // Add timeout for refresh request
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError("Session expired. Please log in again.");
      } else {
        handleAuthError("Failed to refresh session. Please try again.");
      }
      return false;
    }

    const refreshData = await response.json();

    if (refreshData?.data?.tokens?.accessToken) {
      // Store new tokens
      storeTokens(
        refreshData.data.tokens.accessToken,
        refreshData.data.tokens.refreshToken || refreshToken
      );
      return true;
    } else {
      handleAuthError("Invalid refresh response. Please log in again.");
      return false;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    if (error.name === 'TimeoutError') {
      toast.error("Session refresh timed out. Please log in again.");
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return false;
  }
};

// Enhanced base query with improved refresh token logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // First, send the original request
  let result = await baseQuery(args, api, extraOptions);

  // Handle different types of errors
  if (result.error) {
    const { status } = result.error;

    // Handle network errors
    if (status === "FETCH_ERROR") {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: null,
          message: "Network error. Please check your internet connection.",
        },
      };
    }

    // Handle parsing errors
    if (status === "PARSING_ERROR") {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: null,
          message: "Invalid response from server. Please try again.",
        },
      };
    }

    // Handle timeout errors
    if (status === "TIMEOUT_ERROR") {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: null,
          message: "Request timed out. Please try again.",
        },
      };
    }

    // Handle 401 Unauthorized with improved refresh logic
    if (result.error.status === 401) {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        try {
          await refreshPromise;
          // Retry original request after refresh completes
          return await baseQuery(args, api, extraOptions);
        } catch {
          return result;
        }
      }

      // Start refresh process
      isRefreshing = true;
      refreshPromise = refreshAccessToken();

      try {
        const refreshSuccess = await refreshPromise;
        
        if (refreshSuccess) {
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions);
        }
      } catch (error) {
        console.error("Refresh process failed:", error);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Handle other 4xx errors
    if (typeof status === 'number' && status >= 400 && status < 500) {
      const errorMessage = (result.error as any)?.data?.message || "Request failed";
      return {
        error: {
          ...result.error,
          message: errorMessage,
        },
      };
    }

    // Handle 5xx server errors
    if (typeof status === 'number' && status >= 500) {
      return {
        error: {
          ...result.error,
          message: "Server error. Please try again later.",
        },
      };
    }
  }

  return result;
};

// Create the base API with improved configuration
export const optimizedBaseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  // Improved tag types organization
  tagTypes: [
    // User related
    "User",
    "Connections",
    
    // Content related
    "Post",
    "SavedPost",
    "Stories",
    "Hashtag",
    
    // Communication related
    "Chat",
    "Message",
    "Notifications",
    
    // Social related
    "Groups",
    "Events",
    
    // Location related
    "Maps",
    "Itinerary",
    
    // Moderation related
    "Block",
  ],
  endpoints: () => ({}),
  // Add keep unused data for better UX
  keepUnusedDataFor: 60, // 60 seconds
  // Add refetch on reconnect for better offline support
  refetchOnReconnect: true,
});

// Export the optimized API
export default optimizedBaseApi;