import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { activityApi } from "./activity/activity.api";
import rtkMiddleware from "./errorMiddleware";
import { friendsApi } from "./friends/friends.api";
import rootReducer from "./root-reducer";
import { AppDispatch, RESET_STORE } from "./root-reducer.type";
import { usersApi } from "./users/users.api";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([
      usersApi.middleware,
      friendsApi.middleware,
      activityApi.middleware,
      rtkMiddleware,
    ]),
});

export const resetStore = () => ({ type: RESET_STORE });
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const { dispatch } = store;
export default store;
