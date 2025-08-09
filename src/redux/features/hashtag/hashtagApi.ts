import { baseApi } from "../api/baseApi";

const hashtagApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getHashtagPosts: builder.query({
      query: (hashtag) => ({
        url: `/hashtag/posts?hashtag=${hashtag}`,
        method: "GET",
      }),
      providesTags: ["Hashtag","SearchHashtagPosts"],
    }),
    getHashtags: builder.query({
      query: (searchTerms) => ({
        url: `/hashtag?searchTerms=${searchTerms}`,
        method: "GET",
      }),
      providesTags: ["Hashtag"],
    }),
  }),
});

export const { useGetHashtagPostsQuery, useGetHashtagsQuery } = hashtagApi;
