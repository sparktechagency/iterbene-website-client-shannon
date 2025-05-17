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
  }),
});

export const { useGetSingleUserQuery } = usersApi;
