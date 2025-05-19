import { baseApi } from "../api/baseApi";

const hashtagApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getHashtagPosts: builder.query({
      query: (hashtag) => ({
        url: `/hashtag?searchTerm=${hashtag}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetHashtagPostsQuery } = hashtagApi;
