import { baseApi } from "../api/baseApi";

const searchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSearchingData: builder.query({
      query: (query) => ({
        url: `/search?query=${query}`,
        method: "GET",
      }),
    }),
    getSearchHashtagAndUsers: builder.query({
      query: (query) => ({
        url: `/search/hashtag-and-users?query=${query}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSearchingDataQuery, useGetSearchHashtagAndUsersQuery } =
  searchApi;
