import { baseApi } from "../api/baseApi";

const storiesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createStory: builder.mutation({
      query: (formData) => ({
        url: "/stories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Stories"],
    }),
    getStory: builder.query({
      query: (id) => `/stories/${id}`,
    }),
    getFeedStories: builder.query({
      query: () => ({
        url: "/stories/feed",
        method: "GET",
      }),
      providesTags: ["Stories"],
    }),
    viewStory: builder.mutation({
      query: (mediaId) => ({
        url: "/stories/view",
        method: "POST",
        body: { mediaId },
      }),
    }),
    reactToStory: builder.mutation({
      query: ({ mediaId, reactionType }) => ({
        url: "/stories/react",
        method: "POST",
        body: { mediaId, reactionType },
      }),
    }),
    replyToStory: builder.mutation({
      query: ({ mediaId, message }) => ({
        url: "/stories/reply",
        method: "POST",
        body: { mediaId, message },
      }),
    }),
    deleteStory: builder.mutation({
      query: (storyId) => ({
        url: `/stories/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stories"],
    }),
  }),
});

export const {
  useGetFeedStoriesQuery,
  useGetStoryQuery,
  useCreateStoryMutation,
  useViewStoryMutation,
  useReactToStoryMutation,
  useReplyToStoryMutation,
  useDeleteStoryMutation,
} = storiesApi;
