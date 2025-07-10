import { baseApi } from "../api/baseApi";

const reportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createReport: build.mutation({
      query: (data) => ({
        url: "/reports",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateReportMutation } = reportsApi;
