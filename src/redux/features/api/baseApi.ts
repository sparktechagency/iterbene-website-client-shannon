import { getAccessToken } from "@/services/auth.services"; // Assuming you have methods to get and set tokens
import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";

// Define a base query that accesses the token from cookies
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken(); // Get token from cookies
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
    // const refreshToken = getRefreshToken();
    // if (refreshToken) {
    //   try {
    //     const refreshResult = await fetch(
    //       `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ refreshToken }),
    //       }
    //     );
    //     const res = await refreshResult.json();
    //     if (res.ok && res?.accessToken) {
    //       storeTokens(
    //         res?.data?.attributes?.tokens?.accessToken,
    //         res?.data?.attributes?.tokens?.refreshToken
    //       );
    //       // Retry the original request with the new access token
    //       const retryResult = await baseQuery(args, api, extraOptions);
    //       return retryResult;
    //     } else {
    //       toast.error("Session expired. Please log in again.");
    //       window.location.href = "/login";
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     toast.error("Error refreshing token. Please log in again.");
    //   }
    // } else {
    //   toast.error("No refresh token available.");
    // }
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
    "Story",
    "Post",
    "Hashtag",
    "Connections",
  ],
  endpoints: () => ({}),
});
