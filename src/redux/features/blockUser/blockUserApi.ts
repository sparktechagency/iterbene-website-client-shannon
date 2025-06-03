import { baseApi } from "../api/baseApi";

const blockUserApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    blockUser: builder.mutation({
      query: (blockUserId) => ({
        url: `/block-users/block/${blockUserId}`,
        method: "POST",
      }),
      invalidatesTags: ["Block", "Connections"],
    }),
    unBlockUser: builder.mutation({
      query: (blockUserId) => ({
        url: `/block-users/unblock/${blockUserId}`,
        method: "POST",
      }),
      invalidatesTags: ["Block", "Connections"],
    }),
    getMyAllBlockUsers: builder.query({
      query: () => ({
        url: `/block-users/my-block-users`,
        method: "GET",
      }),
      providesTags: ["Block"],
    }),
  }),
});

export const {
  useBlockUserMutation,
  useUnBlockUserMutation,
  useGetMyAllBlockUsersQuery,
} = blockUserApi;
