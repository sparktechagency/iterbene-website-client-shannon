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
      query: (searchTerm) => ({
        url: `/search/users-hashtags?searchTerm=${searchTerm}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSearchingDataQuery, useGetSearchHashtagAndUsersQuery } =
  searchApi;
