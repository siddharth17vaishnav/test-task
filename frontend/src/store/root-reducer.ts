import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import { activityApi } from "./activity/activity.api";
import { friendsApi } from "./friends/friends.api";
import { RESET_STORE, RootReduxState } from "./root-reducer.type";
import userSlice from "./users/user.slice";
import { usersApi } from "./users/users.api";
const appReducer = combineReducers({
  userSlice,
  [usersApi.reducerPath]: usersApi.reducer,
  [friendsApi.reducerPath]: friendsApi.reducer,
  [activityApi.reducerPath]: activityApi.reducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

const useStateSelector: TypedUseSelectorHook<RootReduxState> = useSelector;
export { useStateSelector };
export default rootReducer;
