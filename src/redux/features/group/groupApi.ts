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
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/groups/my-groups",
          method: "GET",
          params,
        };
      },
      providesTags: ["Groups"],
    }),
    getGroup: builder.query({
      query: (groupId) => ({
        url: `/groups/${groupId}`,
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),
    sendGroupInvite: builder.mutation({
      query: (data) => ({
        url: "/groups/invites/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Groups"],
    }),
    joinGroup: builder.mutation({
      query: (data) => ({
        url: "/groups/join",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Groups"],
    }),
    acceptGroupInvite: builder.mutation({
      query: (data) => ({
        url: "/groups/invites/accept",
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
    removeGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),
    getMyJoinedGroups: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: `/groups/my-join-groups`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Groups"],
    }),
    getSuggestionsGroups: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: `/groups/suggestions`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Groups"],
    }),
    getMyInvitedGroups: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.length > 0) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: `/groups/invites/my-invites`,
          method: "GET",
          params,
        };
      },
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
  useGetGroupQuery,
  useJoinGroupMutation,
  useSendGroupInviteMutation,
  useGetMyJoinedGroupsQuery,
  useRemoveGroupMutation,
  useGetSuggestionsGroupsQuery,
  useGetMyInvitedGroupsQuery,
} = groupApi;
