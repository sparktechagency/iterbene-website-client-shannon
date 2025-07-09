// lib/baseApi.ts
import { getAccessToken } from "@/services/auth.services";
import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  fetchFn: async (input, init) => {
    // Set a timeout of 15 seconds
    const signal = AbortSignal.timeout(15000);
    try {
      return await fetch(input, { ...init, signal });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name?: string }).name === "TimeoutError"
      ) {
        throw { status: "TIMEOUT_ERROR", message: "Request timed out" };
      }
      throw error;
    }
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Uncomment and implement your refresh token logic here
    /*
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );
        const res = await refreshResult.json();
        if (res.ok && res?.accessToken) {
          storeTokens(
            res?.data?.attributes?.tokens?.accessToken,
            res?.data?.attributes?.tokens?.refreshToken
          );
          return await baseQuery(args, api, extraOptions);
        } else {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Token refresh error:", error);
        toast.error("Error refreshing token. Please log in again.");
        window.location.href = "/login";
      }
    } else {
      toast.error("No refresh token available.");
      window.location.href = "/login";
    }
    */
  } else if (result?.error?.status === "TIMEOUT_ERROR") {
    toast.error("Request timed out. Please try again later.");
  }

  return result;
};

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
  ],
  endpoints: () => ({}),
});
