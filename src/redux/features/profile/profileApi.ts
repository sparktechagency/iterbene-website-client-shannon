import { baseApi } from "../api/baseApi";

export const profileApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    setLatestLocation: builder.mutation({
      query: (data) => ({
        url: "/user/location",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    fillUpUserInfo: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    addOrUpdatePhotoGallery: builder.mutation({
      query: (data) => ({
        url: "/user/photo-gallery",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deletePhotoGallery: builder.mutation({
      query: (imageId) => ({
        url: `/user/photo-gallery/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateProfileImage: builder.mutation({
      query: (data) => ({
        url: "/user/profile-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateCoverImage: builder.mutation({
      query: (data) => ({
        url: "/user/cover-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteMyProfile: builder.mutation({
      query: () => ({
        url: `/user/profile`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useSetLatestLocationMutation,
  useFillUpUserInfoMutation,
  useAddOrUpdatePhotoGalleryMutation,
  useDeletePhotoGalleryMutation,
  useUpdateProfileImageMutation,
  useUpdateCoverImageMutation,
  useUpdateProfileMutation,
  useDeleteMyProfileMutation,
} = profileApi;
