import { baseApi } from "../api/baseApi";

const postApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Valid post creation with multipart/form-data
    createPost: builder.mutation({
      query: (formData) => {
        return {
          url: "/posts",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Post", "Hashtag"],
    }),
    updatePost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    sharePost: builder.mutation({
      query: (data) => ({
        url: "/posts/share",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    feedPosts: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach((filter: { key: string; value: string }) =>
            params.append(filter.key, filter.value)
          );
        }
        return {
          url: "/posts/feed",
          method: "GET",
          params,
        };
      },
      providesTags: ["Post"],
    }),
    getVisitedPostsWithDistance: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach((filter: { key: string; value: string }) =>
            params.append(filter.key, filter.value)
          );
        }
        return {
          url: "/posts/visited-posts",
          method: "GET",
          params,
        };
      },
      providesTags: ["Post"],
    }),
    getSinglePost: builder.query({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["Post", "SearchHashtagPosts"],
    }),
    getUserTimelinePosts: builder.query({
      query: ({ username, filters }) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter.value && params.append(filter.key, filter.value)
          );
        }
        return {
          url: `/posts/user-timeline/${username}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Post"],
    }),
    getGroupPosts: builder.query({
      query: ({ groupId, filters }) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter.value && params.append(filter.key, filter.value)
          );
        }
        return {
          url: `/posts/group/${groupId}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Post"],
    }),
    getEventPosts: builder.query({
      query: ({ eventId, filters }) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter.value && params.append(filter.key, filter.value)
          );
        }
        return {
          url: `/posts/event/${eventId}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Post"],
    }),
    addOrRemoveReaction: builder.mutation({
      query: (data) => ({
        url: "/posts/reaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: "/posts/comment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    addOrRemoveCommentReaction: builder.mutation({
      query: (data) => ({
        url: "/posts/comment-reaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, postId, comment }) => ({
        url: `/posts/comment/${commentId}`,
        method: "PATCH",
        body: { postId, comment },
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    deleteComment: builder.mutation({
      query: ({ commentId, postId }) => ({
        url: `/posts/comment/${commentId}`,
        method: "DELETE",
        body: { postId },
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
    incrementItineraryViewCount: builder.mutation({
      query: (data) => ({
        url: `/posts/increment-itinerary-view-count`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "SearchHashtagPosts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useSharePostMutation,
  useFeedPostsQuery,
  useGetUserTimelinePostsQuery,
  useGetGroupPostsQuery,
  useGetEventPostsQuery,
  useDeletePostMutation,
  useGetSinglePostQuery,
  useUpdatePostMutation,
  useAddOrRemoveReactionMutation,
  useCreateCommentMutation,
  useGetVisitedPostsWithDistanceQuery,
  useAddOrRemoveCommentReactionMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useIncrementItineraryViewCountMutation,
} = postApi;

export default postApi;
