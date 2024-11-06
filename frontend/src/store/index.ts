import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { usersApi } from "./users/users.api";
import { AppDispatch, RESET_STORE } from "./root-reducer.type";
import rootReducer from "./root-reducer";
import rtkMiddleware from "./errorMiddleware";
import { friendsApi } from "./friends/friends.api";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([usersApi.middleware, friendsApi.middleware, rtkMiddleware]),
});

export const resetStore = () => ({ type: RESET_STORE });
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const { dispatch } = store;
export default store;
