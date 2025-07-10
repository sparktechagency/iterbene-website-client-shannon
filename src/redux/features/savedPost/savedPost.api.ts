import { baseApi } from "../api/baseApi";

const savedPostApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSavedPost: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          filters?.forEach(
            (filter: { key: string; value: string }) =>
              filter?.value && params.append(filter?.key, filter?.value)
          );
        }
        return {
          url: "/saved-post-itinerary",
          method: "GET",
          params,
        };
      },
      providesTags: ["SavedPost"],
    }),
    savePost: builder.mutation({
      query: (data) => ({
        url: "/saved-post-itinerary",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SavedPost"],
    }),
    unsavePost: builder.mutation({
      query: (id) => ({
        url: `/saved-post-itinerary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedPost"],
    }),
    isPostSaved: builder.query({
      query: (id) => ({
        url: `/saved-post-itinerary/already-saved/${id}`,
        method: "GET",
      }),
      providesTags: ["SavedPost"],
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetSavedPostQuery,
  useSavePostMutation,
  useUnsavePostMutation,
  useIsPostSavedQuery
} = savedPostApi;
