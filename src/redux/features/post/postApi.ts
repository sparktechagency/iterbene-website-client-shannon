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
      query: (data) => ({
        url: "/posts",
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
      invalidatesTags: ["Post"],
    }),
    sharePost: builder.mutation({
      query: (data) => ({
        url: "/posts/share",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    feedPosts: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();

        console.log("Filters:", filters);
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
    getUserTimelinePosts: builder.query({
      query: ({ username, filters }) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach((filter: { key: string; value: string }) =>
            params.append(filter.key, filter.value)
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
      query: (groupId) => ({
        url: `/posts/group/${groupId}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
    getEventPosts: builder.query({
      query: (eventId) => ({
        url: `/posts/event/${eventId}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
    addOrRemoveReaction: builder.mutation({
      query: (data) => ({
        url: "/posts/reaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: "/posts/comment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, comment }) => ({
        url: `/posts/comment/${commentId}`,
        method: "PATCH",
        body: { comment },
      }),
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/posts/comment/${commentId}`,
        method: "DELETE",
      }),
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
  useUpdatePostMutation,
  useAddOrRemoveReactionMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = postApi;

export default postApi;
