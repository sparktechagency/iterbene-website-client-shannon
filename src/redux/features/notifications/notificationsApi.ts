import { baseApi } from "../api/baseApi";

const notificationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/notifications",
          method: "GET",
          params,
        };
      },
      providesTags: ["Notifications"],
    }),
    viewAllNotifications: builder.mutation({
      query: () => ({
        url: "/notifications/view-all-notifications",
        method: "POST",
      }),

      invalidatesTags: ["Notifications"],
    }),
    viewSingleNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "PATCH",
      }),

      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useViewAllNotificationsMutation,
  useViewSingleNotificationMutation,
} = notificationsApi;
