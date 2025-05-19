import { baseApi } from "../api/baseApi";

const itineraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createItinerary: builder.mutation({
      query: (data) => ({
        url: "/itinerary",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateItineraryMutation } = itineraryApi;
