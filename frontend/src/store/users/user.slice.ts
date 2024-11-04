import { createSlice } from "@reduxjs/toolkit";
import { User } from "./users.type";

const initialState: User = {
  id: 0,
  name: "",
  email: "",
  last_login_at: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: User }) => {
      Object.keys(payload).forEach((key) => {
        const reduxState = state as Record<string, string | number>;
        const accountPayload = payload as unknown as Record<
          string,
          string | number
        >;
        reduxState[key] = accountPayload[key];
      });
    },
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
