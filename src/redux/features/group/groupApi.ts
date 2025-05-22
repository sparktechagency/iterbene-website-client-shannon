import { baseApi } from "../api/baseApi";

const groupApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (data) => ({
        url: "/groups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Groups"],
    }),
    getMyGroups: builder.query({
      query: () => ({
        url: "/groups/my-groups",
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),
    acceptGroupInvite: builder.mutation({
      query: (data) => ({
        url: "/groups/invite/accept",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Groups"],
    }),
    declineGroupInvite: builder.mutation({
      query: (data) => ({
        url: "/groups/invites/decline",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Groups"],
    }),
    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/leave`,
        method: "POST",
        body: { groupId },
      }),
      invalidatesTags: ["Groups"],
    }),
    getMyJoinedGroups: builder.query({
      query: () => ({
        url: "/groups/my-join-groups",
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),
    getSuggestionsGroups: builder.query({
      query: () => ({
        url: "/groups/suggestions",
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),
    getMyInvitedGroups: builder.query({
      query: () => ({
        url: "/groups/invites/my-invites",
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetMyGroupsQuery,
  useAcceptGroupInviteMutation,
  useDeclineGroupInviteMutation,
  useLeaveGroupMutation,
  useGetMyJoinedGroupsQuery,
  useGetSuggestionsGroupsQuery,
  useGetMyInvitedGroupsQuery,
} = groupApi;
