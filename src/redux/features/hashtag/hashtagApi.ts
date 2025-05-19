import { baseApi } from "../api/baseApi";

const hashtagApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getHashtagPosts: builder.query({
      query: (hashtag) => ({
        url: `/hashtag?searchTerm=${hashtag}`,
        method: "GET",
      }),
      providesTags: ["Hashtag"],
    }),
  }),
});

export const { useGetHashtagPostsQuery } = hashtagApi;
