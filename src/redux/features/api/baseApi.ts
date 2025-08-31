import { getApiToken, getToken, TokenType, setToken } from "@/utils/tokenManager";
import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";

// Define a base query that accesses the token from encrypted cookies
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    // Get appropriate token based on endpoint
    let token: string | null = null;
    
    // For auth endpoints, use specific tokens
    if (endpoint === 'verifyEmail') {
      token = getToken(TokenType.EMAIL_VERIFICATION_TOKEN);
    } else if (endpoint === 'resetPassword') {
      token = getToken(TokenType.RESET_PASSWORD_TOKEN);
    } else {
      // For all other endpoints, use access token
      token = getApiToken();
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = getToken(TokenType.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        const refreshResult = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${refreshToken}`
            },
          }
        );
        const res = await refreshResult.json();
        if (res.code === 200 && res?.data?.attributes?.tokens) {
          // Store new tokens
          setToken(TokenType.ACCESS_TOKEN, res.data.attributes.tokens.accessToken, 120);
          setToken(TokenType.REFRESH_TOKEN, res.data.attributes.tokens.refreshToken, 8760);
          
          // Retry the original request with the new access token
          const retryResult = await baseQuery(args, api, extraOptions);
          return retryResult;
        } else {
          // Token refresh failed, perform complete logout
          import("@/utils/logoutManager").then(({ performLogout }) => {
            performLogout(null, "/login");
          });
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Token refresh error, perform complete logout
        import("@/utils/logoutManager").then(({ performLogout }) => {
          performLogout(null, "/login");
        });
      }
    } else {
      // No refresh token, perform complete logout
      import("@/utils/logoutManager").then(({ performLogout }) => {
        performLogout(null, "/login");
      });
    }
  }
  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
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
    "SearchHashtagPosts",
  ],
  endpoints: () => ({}),
});
