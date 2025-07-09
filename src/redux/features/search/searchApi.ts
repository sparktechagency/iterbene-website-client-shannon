import { baseApi } from "../api/baseApi";

const searchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSearchingLocationsPosts: builder.query({
      query: ({ page, limit, query }) => ({
        url: `/search/location-post?searchTerm=${query}`,
        method: "GET",
        params: { page, limit },
      }),
    }),
    getSearchHashtagAndUsers: builder.query({
      query: (searchTerm) => ({
        url: `/search/users-hashtags?searchTerm=${searchTerm}`,
        method: "GET",
      }),
    }),
    getLocationVisitedPlaces: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/search/location-visited-places",
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const {
  useGetSearchingLocationsPostsQuery,
  useGetSearchHashtagAndUsersQuery,
  useGetLocationVisitedPlacesQuery,
} = searchApi;
