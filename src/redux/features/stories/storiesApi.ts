import { baseApi } from "../api/baseApi";

const storiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoryFeed: builder.query({
      query: () => "/stories/feed",
      providesTags: ["Stories"],
    }),
    getStory: builder.query({
      query: (id) => `/stories/${id}`,
      providesTags: (result, error, id) => [{ type: "Story", id }],
    }),
    createStory: builder.mutation({
      query: (formData) => ({
        url: "/stories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Stories"],
    }),
    viewStory: builder.mutation({
      query: (storyId) => ({
        url: "/stories/view",
        method: "POST",
        body: { storyId },
      }),
      invalidatesTags: (result, error, { storyId }) => [
        { type: "Story", id: storyId },
      ],
    }),
    reactToStory: builder.mutation({
      query: ({ storyId, reactionType }) => ({
        url: "/stories/react",
        method: "POST",
        body: { storyId, reactionType },
      }),
      invalidatesTags: (result, error, { storyId }) => [
        { type: "Story", id: storyId },
      ],
    }),
    replyToStory: builder.mutation({
      query: ({ storyId, message }) => ({
        url: "/stories/reply",
        method: "POST",
        body: { storyId, message },
      }),
      invalidatesTags: (result, error, { storyId }) => [
        { type: "Story", id: storyId },
      ],
    }),
  }),
});

export const {
  useGetStoryFeedQuery,
  useGetStoryQuery,
  useCreateStoryMutation,
  useViewStoryMutation,
  useReactToStoryMutation,
  useReplyToStoryMutation,
} = storiesApi;
