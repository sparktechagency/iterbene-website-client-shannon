import { baseApi } from "../api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleUser: builder.query({
      query: (userName) => ({
        url: `/users/username/${userName}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getSingleByUserId: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updatePrivacySettings: builder.mutation({
      query: (data) => ({
        url: "/users/privacy-settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetSingleUserQuery,
  useGetSingleByUserIdQuery,
  useUpdatePrivacySettingsMutation,
} = usersApi;
