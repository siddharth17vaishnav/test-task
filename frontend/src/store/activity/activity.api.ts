import { API } from "@/constans/api";
import { prepareHeaders } from "@/utils/tokenManager";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Activity {
  created_at: string;
  description: string;
  id: number;
  type: string;
}

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders,
  }),

  endpoints: (builder) => ({
    getActivity: builder.query<Activity[], void>({
      query: () => ({
        url: API.ACTIVITY,
      }),
    }),
  }),
});

export const { useGetActivityQuery } = activityApi;
