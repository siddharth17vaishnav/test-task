import store from "@/store";
import { Action, ThunkAction } from "@reduxjs/toolkit";
import { User } from "./users/users.type";

export interface RootReduxState {
  userSlice: User;
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<T = Promise<void> | void> = ThunkAction<
  T,
  RootReduxState,
  unknown,
  Action<string>
>;

export const RESET_STORE = "RESET_STORE";

export interface ErrorResponse {
  status: number;
  data: {
    message: string;
  };
}
