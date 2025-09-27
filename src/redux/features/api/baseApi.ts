import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";

import { getCookie, COOKIE_NAMES } from "@/utils/cookies";

// Define a base query that gets token from cookies
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    // Get access token from cookies
    const token = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
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

  // For now, just return the result. 
  // Refresh token logic can be implemented later if needed
  if (result?.error?.status === 401) {
    // Clear cookies on 401 error
    document.cookie = 'at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'rt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to login can be handled by the component
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
    "MessageNotifications",
    "SavedPost",
    "SearchHashtagPosts",
  ],
  endpoints: () => ({}),
});
