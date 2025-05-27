import { baseApi } from "../api/baseApi";

const eventApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    joinEvent: builder.mutation({
      query: (data) => ({
        url: `/events/join`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    getMyEvents: builder.query({
      query: () => ({
        url: "/events/my-events",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getMyInvites: builder.query({
      query: () => ({
        url: "/events/invites/my-invites",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getEvent: builder.query({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getMyInterestedEvents: builder.query({
      query: () => ({
        url: "/events/my-interested-events",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    getSuggestionsEvents: builder.query({
      query: () => ({
        url: "/events/suggestions",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    sendEventInvite: builder.mutation({
      query: (data) => ({
        url: "/events/invites/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    acceptEventInvite: builder.mutation({
      query: (data) => ({
        url: `/events/invites/accept`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
    declineEventInvite: builder.mutation({
      query: (data) => ({
        url: `/events/invites/decline`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useJoinEventMutation,
  useGetMyEventsQuery,
  useGetMyInvitesQuery,
  useGetEventQuery,
  useGetMyInterestedEventsQuery,
  useGetSuggestionsEventsQuery,
  useSendEventInviteMutation,
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
} = eventApi;
