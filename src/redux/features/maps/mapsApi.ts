import { baseApi } from "../api/baseApi";

const mapsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyMaps: builder.query({
      query: () => ({
        url: "/maps/my-maps",
        method: "GET",
      }),
      providesTags: ["Maps"],
    }),
    addInterstedLocation: builder.mutation({
      query: (data) => ({
        url: "/maps/add-interested-location",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Maps"],
    }),
  }),
});

export const { useGetMyMapsQuery, useAddInterstedLocationMutation } = mapsApi;
