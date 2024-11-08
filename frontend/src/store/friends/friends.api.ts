import { API } from "@/constans/api";
import { prepareHeaders } from "@/utils/tokenManager";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../users/users.type";

interface FriendsResponse {
  requests: {
    id: number;
    status: string;
    user: User;
    added_by: User;
  }[];
}

export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders,
  }),

  endpoints: (builder) => ({
    searchFriend: builder.query<User[], string>({
      query: (search) => ({
        url: `${API.SEARCH_FRIENDS}?search=${search}`,
      }),
    }),
    getFriends: builder.query<FriendsResponse, void>({
      query: () => ({
        url: API.FRIENDS,
      }),
    }),
    sendFriendRequest: builder.mutation<void, number>({
      query: (friendId) => ({
        url: `${API.SEND_FRIEND_REQUEST}`,
        method: "POST",
        body: { id: friendId },
      }),
    }),
    acceptRequest: builder.mutation<void, number>({
      query: (friendId) => ({
        url: `${API.ACCEPT_REQUEST(friendId)}`,
        method: "PUT",
      }),
    }),
    rejectRequest: builder.mutation<void, number>({
      query: (friendId) => ({
        url: `${API.REJECT_REQUEST(friendId)}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useSearchFriendQuery,
  useLazySearchFriendQuery,
  useSendFriendRequestMutation,
  useGetFriendsQuery,
  useAcceptRequestMutation,
  useRejectRequestMutation,
} = friendsApi;
