import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
} from "@/services/auth.services";
import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

// Define base query with timeout and authorization headers
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  timeout: 15000, // 15 seconds timeout
});

// Enhanced base query with refresh token logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // First, send the original request
  let result = await baseQuery(args, api, extraOptions);

  // Handle network or timeout errors
  if (result.error) {
    const { status } = result.error;

    // Handle timeout or network issues
    if (status === "FETCH_ERROR") {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: null,
          message:
            "Network error: Unable to connect to server. Please check your internet connection.",
        },
      };
    }

    if (status === "PARSING_ERROR") {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: null,
          message: "Parsing error: Invalid response from server.",
        },
      };
    }

    // Only handle 401 Unauthorized for token refresh
    if (result.error.status === 401) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        toast.error("No refresh token found. Please log in again.");
        window.location.href = "/login";
        return result;
      }

      try {
        // Attempt to refresh the access token
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          }
        );

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok && refreshData?.data?.tokens?.accessToken) {
          // Store new tokens
          storeTokens(
            refreshData.data.tokens.accessToken,
            refreshData.data.tokens.refreshToken
          );
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        toast.error("Failed to refresh session. Please log in again.");
        window.location.href = "/login";
      }
    }
  }

  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Chat",
    "Groups",
    "Events",
    "Message",
    "Maps",
    "Block",
    "Stories",
    "Post",
    "Hashtag",
    "Connections",
    "Itinerary",
    "Notifications",
    "SavedPost",
  ],
  endpoints: () => ({}),
});

// Export baseApi to be used in your store
export default baseApi;
