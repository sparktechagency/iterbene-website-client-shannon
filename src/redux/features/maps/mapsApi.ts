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
  }),
});

export const { useGetMyMapsQuery } = mapsApi;
