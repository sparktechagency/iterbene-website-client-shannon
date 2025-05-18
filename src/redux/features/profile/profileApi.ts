import { baseApi } from "../api/baseApi";

export const profileApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: `/users/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    setLatestLocation: builder.mutation({
      query: (data) => ({
        url: "/users/location",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfileImage: builder.mutation({
      query: (data) => ({
        url: "/users/profile-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateCoverImage: builder.mutation({
      query: (data) => ({
        url: "/users/cover-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteMyProfile: builder.mutation({
      query: () => ({
        url: `/users/profile`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useSetLatestLocationMutation,
  useUpdateProfileImageMutation,
  useUpdateCoverImageMutation,
  useUpdateProfileMutation,
  useDeleteMyProfileMutation,
} = profileApi;
