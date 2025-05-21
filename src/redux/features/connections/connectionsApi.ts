import { baseApi } from "../api/baseApi";

const connectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addConnection: builder.mutation({
      query: (data) => ({
        url: "/connections/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Connections"],
    }),
    checkIsSentConnectionExists: builder.query({
      query: (friendId) => ({
        url: `/connections/check-sent-connection/${friendId}`,
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    acceptConnection: builder.mutation({
      query: (connectionId) => ({
        url: `/connections/accept/${connectionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Connections"],
    }),
    cancelConnection: builder.mutation({
      query: (friendId) => ({
        url: `/connections/cancel/${friendId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),
    removeSuggestionConnection: builder.mutation({
      query: (removedByUserId) => ({
        url: `/connections/remove/${removedByUserId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Connections"],
    }),
    deleteConnection: builder.mutation({
      query: (connectionId) => ({
        url: `/connections/${connectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),
    getMyConnections: builder.query({
      query: () => ({
        url: "/connections",
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    getConnectionRequests: builder.query({
      query: () => ({
        url: "/connections/requests/received",
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    getSentConnectionRequests: builder.query({
      query: () => ({
        url: "/connections/requests/sent",
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    getSuggestionsConnections: builder.query({
      query: () => ({
        url: "/connections/suggestions",
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
  }),
});

export const {
  useAddConnectionMutation,
  useAcceptConnectionMutation,
  useCancelConnectionMutation,
  useCheckIsSentConnectionExistsQuery,
  useRemoveSuggestionConnectionMutation,
  useDeleteConnectionMutation,
  useGetMyConnectionsQuery,
  useGetConnectionRequestsQuery,
  useGetSentConnectionRequestsQuery,
  useGetSuggestionsConnectionsQuery,
} = connectionsApi;
