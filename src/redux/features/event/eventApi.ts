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
    interestEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/interest/${eventId}`,
        method: "POST",
      }),
      invalidatesTags: ["Events"],
    }),
    notInterestEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/not-interest/${eventId}`,
        method: "POST",
      }),
      invalidatesTags: ["Events"],
    }),
    removeEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "DELETE",
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
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/events/suggestions",
          method: "GET",
          params,
        };
      },
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
  useInterestEventMutation,
  useNotInterestEventMutation,
  useRemoveEventMutation,
  useGetMyEventsQuery,
  useGetMyInvitesQuery,
  useGetEventQuery,
  useGetMyInterestedEventsQuery,
  useGetSuggestionsEventsQuery,
  useSendEventInviteMutation,
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
} = eventApi;
