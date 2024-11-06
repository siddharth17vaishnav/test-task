export const API = {
  LOGIN: "/api/user/login",
  SIGNUP: "/api/user",
  ME: "/api/user/me",
  UPDATE_PASSWORD: "api/user/update-password",
  SEARCH_FRIENDS: "/api/friends",
  SEND_FRIEND_REQUEST: "/api/friends",
  FRIENDS: "/api/friends/requests",
  ACCEPT_REQUEST: (id: number) => `/api/friends/${id}/accept`,
  REJECT_REQUEST: (id: number) => `/api/friends/${id}/reject`,
};
