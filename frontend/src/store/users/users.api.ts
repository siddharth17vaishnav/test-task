import { API } from "@/constans/api";
import { prepareHeaders } from "@/utils/tokenManager";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponse, User } from "./users.type";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload extends LoginPayload {
  first_name: string;
  last_name: string;
}
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: API.LOGIN,
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation<LoginResponse, SignupPayload>({
      query: (body) => ({
        url: API.SIGNUP,
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query<{ data: User }, void>({
      query: (body) => ({
        url: API.ME,
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetUserQuery } =
  usersApi;
