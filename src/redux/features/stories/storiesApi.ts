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
      query: (storyId) => ({
        url: "/stories/view",
        method: "POST",
        body: { storyId },
      }),
    }),
    reactToStory: builder.mutation({
      query: ({ storyId, reactionType }) => ({
        url: "/stories/react",
        method: "POST",
        body: { storyId, reactionType },
      }),
    }),
    replyToStory: builder.mutation({
      query: ({ storyId, message }) => ({
        url: "/stories/reply",
        method: "POST",
        body: { storyId, message },
      })
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
} = storiesApi;
